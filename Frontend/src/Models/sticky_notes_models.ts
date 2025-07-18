// src/Models/StickyNotesModel.ts

// מודל פתק נדבק
export interface StickyNote {
    id: number;
    title: string;
    content: string;
    color: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
    created_at?: Date | string;
    updated_at?: Date | string;
    is_deleted?: boolean;
}

// מודל לצורך הוספה/עדכון של פתק
export interface StickyNotePayload {
    title: string;
    content: string;
    color: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
}

// מודל עדכון תוכן בלבד
export interface StickyNoteContentUpdate {
    title: string;
    content: string;
}

// מודל עדכון מיקום
export interface StickyNotePositionUpdate {
    x: number;
    y: number;
}

// מודל עדכון גודל
export interface StickyNoteSizeUpdate {
    width: number;
    height: number;
}

// מודל עדכון צבע
export interface StickyNoteColorUpdate {
    color: string;
}

// צבעים זמינים לפתקים
export const STICKY_NOTE_COLORS = [
    { name: 'צהוב', value: '#ffeb3b' },
    { name: 'כתום', value: '#ff9800' },
    { name: 'ורוד', value: '#e91e63' },
    { name: 'אדום', value: '#f44336' },
    { name: 'סגול', value: '#9c27b0' },
    { name: 'כחול', value: '#2196f3' },
    { name: 'ירוק', value: '#4caf50' },
    { name: 'ירוק בהיר', value: '#8bc34a' },
    { name: 'תכלת', value: '#00bcd4' },
    { name: 'אפור', value: '#9e9e9e' }
];

// גדלים ברירת מחדל
export const DEFAULT_NOTE_SIZE = {
    width: 200,
    height: 200,
    minWidth: 150,
    minHeight: 100,
    maxWidth: 400,
    maxHeight: 400
};

// מיקום ברירת מחדל
export const DEFAULT_NOTE_POSITION = {
    x: 50,
    y: 50
};