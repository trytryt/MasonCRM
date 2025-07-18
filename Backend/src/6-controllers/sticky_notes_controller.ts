import express, { Request, Response, NextFunction } from "express";
import stickyNotesLogic from "../5-logic/sticky_notes_logic";
import StickyNoteModel from "../4-models/sticky_note_model";

const router = express.Router();

// קבלת כל הפתקים הנדבקים
router.get("/sticky-notes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const notes = await stickyNotesLogic.getAllStickyNotes();
        response.json(notes);
    }
    catch (error: any) {
        next(error);
    }
});

// קבלת פתק ספציפי לפי מזהה
router.get("/sticky-notes/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const note = await stickyNotesLogic.getOneStickyNote(id);
        response.json(note);
    }
    catch (error: any) {
        next(error);
    }
});

// הוספת פתק חדש
router.post("/sticky-notes", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const note = new StickyNoteModel(request.body);
        const addedNote = await stickyNotesLogic.addStickyNote(note);
        response.status(201).json(addedNote);
    }
    catch (error: any) {
        next(error);
    }
});

// יצירת פתק חדש במיקום פנוי
router.post("/sticky-notes/create-new", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const newNote = await stickyNotesLogic.createNoteAtFreePosition();
        response.status(201).json(newNote);
    }
    catch (error: any) {
        next(error);
    }
});

// עדכון פתק מלא
router.put("/sticky-notes/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        request.body.id = id;
        
        const note = new StickyNoteModel(request.body);
        const updatedNote = await stickyNotesLogic.updateStickyNote(note);
        
        response.json(updatedNote);
    }
    catch (error: any) {
        next(error);
    }
});

// עדכון תוכן פתק בלבד (לשמירה אוטומטית)
router.patch("/sticky-notes/:id/content", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const { title, content } = request.body;
        
        const updatedNote = await stickyNotesLogic.updateStickyNoteContent(id, title, content);
        response.json(updatedNote);
    }
    catch (error: any) {
        next(error);
    }
});

// עדכון מיקום פתק (לגרירה)
router.patch("/sticky-notes/:id/position", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const { x, y } = request.body;
        
        const updatedNote = await stickyNotesLogic.updateStickyNotePosition(id, x, y);
        response.json(updatedNote);
    }
    catch (error: any) {
        next(error);
    }
});

// עדכון גודל פתק
router.patch("/sticky-notes/:id/size", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const { width, height } = request.body;
        
        const updatedNote = await stickyNotesLogic.updateStickyNoteSize(id, width, height);
        response.json(updatedNote);
    }
    catch (error: any) {
        next(error);
    }
});

// עדכון צבע פתק
router.patch("/sticky-notes/:id/color", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const { color } = request.body;
        
        const updatedNote = await stickyNotesLogic.updateStickyNoteColor(id, color);
        response.json(updatedNote);
    }
    catch (error: any) {
        next(error);
    }
});

// מחיקת פתק
router.delete("/sticky-notes/:id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const id = +request.params.id;
        const success = await stickyNotesLogic.deleteStickyNote(id);
        
        if(success) {
            response.json({ success: true, message: "הפתק נמחק בהצלחה" });
        }
        else {
            response.status(404).json({ success: false, message: "הפתק לא נמצא או כבר נמחק" });
        }
    }
    catch (error: any) {
        next(error);
    }
});

// ניקוי פתקים נמחקים ישנים
router.delete("/sticky-notes/cleanup/old", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const deletedCount = await stickyNotesLogic.cleanupDeletedNotes();
        response.json({ 
            success: true, 
            message: `נמחקו ${deletedCount} פתקים ישנים`,
            deletedCount 
        });
    }
    catch (error: any) {
        next(error);
    }
});

export default router;