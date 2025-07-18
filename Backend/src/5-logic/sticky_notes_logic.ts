import dal from "../2-utils/dal";
import { OkPacket } from "mysql";
import { ResourceNotFoundErrorModel } from "../4-models/ErrorModel";
import StickyNoteModel from "../4-models/sticky_note_model";

// קבלת כל הפתקים הנדבקים (פעילים בלבד)
async function getAllStickyNotes(): Promise<StickyNoteModel[]> {
    const sql = `SELECT * FROM sticky_notes 
                 WHERE is_deleted = 0 
                 ORDER BY updated_at DESC`;
    
    const notes = await dal.execute(sql);
    return notes;
}

// קבלת פתק ספציפי לפי מזהה
async function getOneStickyNote(id: number): Promise<StickyNoteModel> {
    const sql = `SELECT * FROM sticky_notes 
                 WHERE id = ? AND is_deleted = 0`;
    
    const notes = await dal.execute(sql, [id]);
    
    const note = notes[0];
    if (!note) throw new ResourceNotFoundErrorModel(id);
    
    return note;
}

// הוספת פתק חדש
async function addStickyNote(note: StickyNoteModel): Promise<StickyNoteModel> {
    // בדיקת תקינות
    const error = note.validate();
    if (error) throw new Error(error);

    const sql = `INSERT INTO sticky_notes(title, content, color, position_x, position_y, width, height, created_at, updated_at, is_deleted)
                 VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const result: OkPacket = await dal.execute(sql, [
        note.title,
        note.content,
        note.color,
        note.position_x,
        note.position_y,
        note.width,
        note.height,
        note.created_at,
        note.updated_at,
        note.is_deleted
    ]);

    // שמירת ה-ID שנוצר
    note.id = result.insertId;
    
    return note;
}

// עדכון פתק קיים (כולל תוכן, מיקום, גודל וצבע)
async function updateStickyNote(note: StickyNoteModel): Promise<StickyNoteModel> {
    // בדיקת תקינות
    const error = note.validate();
    if (error) throw new Error(error);
    
    // בדיקה שהפתק קיים
    const existingNote = await getOneStickyNote(note.id);
    if (!existingNote) {
        throw new ResourceNotFoundErrorModel(note.id);
    }
    
    // עדכון הפתק
    const sql = `UPDATE sticky_notes 
                 SET title = ?, 
                     content = ?, 
                     color = ?,
                     position_x = ?,
                     position_y = ?,
                     width = ?,
                     height = ?,
                     updated_at = NOW()
                 WHERE id = ? AND is_deleted = 0`;
    
    const params = [
        note.title,
        note.content,
        note.color,
        note.position_x,
        note.position_y,
        note.width,
        note.height,
        note.id
    ];
    
    const result: OkPacket = await dal.execute(sql, params);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(note.id);
    }
    
    // החזרת הפתק המעודכן
    return await getOneStickyNote(note.id);
}

// עדכון תוכן פתק בלבד (לשמירה אוטומטית בזמן הקלדה)
async function updateStickyNoteContent(id: number, title: string, content: string): Promise<StickyNoteModel> {
    // בדיקה שהפתק קיים
    const existingNote = await getOneStickyNote(id);
    if (!existingNote) {
        throw new ResourceNotFoundErrorModel(id);
    }
    
    const sql = `UPDATE sticky_notes 
                 SET title = ?, 
                     content = ?, 
                     updated_at = NOW()
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [title, content, id]);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(id);
    }
    
    return await getOneStickyNote(id);
}

// עדכון מיקום פתק (לגרירה)
async function updateStickyNotePosition(id: number, x: number, y: number): Promise<StickyNoteModel> {
    const sql = `UPDATE sticky_notes 
                 SET position_x = ?, 
                     position_y = ?, 
                     updated_at = NOW()
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [x, y, id]);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(id);
    }
    
    return await getOneStickyNote(id);
}

// עדכון גודל פתק
async function updateStickyNoteSize(id: number, width: number, height: number): Promise<StickyNoteModel> {
    const sql = `UPDATE sticky_notes 
                 SET width = ?, 
                     height = ?, 
                     updated_at = NOW()
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [width, height, id]);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(id);
    }
    
    return await getOneStickyNote(id);
}

// עדכון צבע פתק
async function updateStickyNoteColor(id: number, color: string): Promise<StickyNoteModel> {
    const sql = `UPDATE sticky_notes 
                 SET color = ?, 
                     updated_at = NOW()
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [color, id]);
    
    if (result.affectedRows === 0) {
        throw new ResourceNotFoundErrorModel(id);
    }
    
    return await getOneStickyNote(id);
}

// מחיקת פתק (מחיקה לוגית)
async function deleteStickyNote(id: number): Promise<boolean> {
    const sql = `UPDATE sticky_notes 
                 SET is_deleted = 1, updated_at = NOW()
                 WHERE id = ? AND is_deleted = 0`;
    
    const result: OkPacket = await dal.execute(sql, [id]);
    return result.affectedRows > 0;
}

// ניקוי פתקים נמחקים ישנים (אחרי 30 יום)
async function cleanupDeletedNotes(): Promise<number> {
    const sql = `DELETE FROM sticky_notes 
                 WHERE is_deleted = 1 
                 AND updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`;
    
    const result: OkPacket = await dal.execute(sql);
    return result.affectedRows;
}

// יצירת פתק חדש במיקום פנוי
async function createNoteAtFreePosition(): Promise<StickyNoteModel> {
    // חיפוש מיקום פנוי
    const existingPositions = await dal.execute(
        `SELECT position_x, position_y FROM sticky_notes WHERE is_deleted = 0`
    );
    
    let x = 50, y = 50;
    const gridSize = 250; // מרווח בין פתקים
    
    // חיפוש מיקום פנוי בגריד
    let positionFound = false;
    for (let row = 0; row < 10 && !positionFound; row++) {
        for (let col = 0; col < 10 && !positionFound; col++) {
            const testX = 50 + (col * gridSize);
            const testY = 50 + (row * gridSize);
            
            const occupied = existingPositions.some((pos: any) => 
                Math.abs(pos.position_x - testX) < 200 && 
                Math.abs(pos.position_y - testY) < 200
            );
            
            if (!occupied) {
                x = testX;
                y = testY;
                positionFound = true;
            }
        }
    }
    
    const newNote = new StickyNoteModel({
        title: "פתק חדש",
        content: "כתוב כאן...",
        color: "#ffeb3b",
        position_x: x,
        position_y: y,
        width: 200,
        height: 200
    });
    
    return await addStickyNote(newNote);
}

export default {
    getAllStickyNotes,
    getOneStickyNote,
    addStickyNote,
    updateStickyNote,
    updateStickyNoteContent,
    updateStickyNotePosition,
    updateStickyNoteSize,
    updateStickyNoteColor,
    deleteStickyNote,
    cleanupDeletedNotes,
    createNoteAtFreePosition
};