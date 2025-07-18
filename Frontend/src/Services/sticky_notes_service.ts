// src/Services/StickyNotesService.ts

import axios from "axios";
import appConfig from "../Utils/Config";
import {
    StickyNote,
    StickyNotePayload,
    StickyNoteContentUpdate,
    StickyNotePositionUpdate,
    StickyNoteSizeUpdate,
    StickyNoteColorUpdate
} from "../Models/sticky_notes_models";

class StickyNotesService {
    // קבלת כל הפתקים הנדבקים
    public async getAllStickyNotes(): Promise<StickyNote[]> {
        try {
            const response = await axios.get<StickyNote[]>(appConfig.stickyNotesUrl);
            return response.data;
        } catch (error) {
            console.error("Error fetching sticky notes:", error);
            throw error;
        }
    }

    // קבלת פתק ספציפי לפי מזהה
    public async getStickyNoteById(id: number): Promise<StickyNote> {
        const url = `${appConfig.stickyNotesUrl}${id}`;
        
        try {
            const response = await axios.get<StickyNote>(url);
            return response.data;
        } catch (error) {
            console.error(`Error fetching sticky note with ID ${id}:`, error);
            throw error;
        }
    }

    // הוספת פתק חדש
    public async addStickyNote(note: StickyNotePayload): Promise<StickyNote> {
        try {
            const response = await axios.post<StickyNote>(appConfig.stickyNotesUrl, note);
            console.log("Sticky note added successfully.");
            return response.data;
        } catch (error) {
            console.error("Error adding sticky note:", error);
            throw error;
        }
    }

    // יצירת פתק חדש במיקום פנוי
    public async createNewStickyNote(): Promise<StickyNote> {
        try {
            const response = await axios.post<StickyNote>(appConfig.createNewStickyNoteUrl);
            console.log("New sticky note created successfully.");
            return response.data;
        } catch (error) {
            console.error("Error creating new sticky note:", error);
            throw error;
        }
    }

    // עדכון פתק מלא
    public async updateStickyNote(note: StickyNote): Promise<StickyNote> {
        const url = appConfig.updateStickyNoteUrl.replace(':id', note.id.toString());
        
        try {
            const response = await axios.put<StickyNote>(url, note);
            console.log("Sticky note updated successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error updating sticky note with ID ${note.id}:`, error);
            throw error;
        }
    }

    // עדכון תוכן פתק (לשמירה אוטומטית)
    public async updateStickyNoteContent(id: number, update: StickyNoteContentUpdate): Promise<StickyNote> {
        const url = appConfig.updateStickyNoteContentUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.patch<StickyNote>(url, update);
            return response.data;
        } catch (error) {
            console.error(`Error updating sticky note content with ID ${id}:`, error);
            throw error;
        }
    }

    // עדכון מיקום פתק (לגרירה)
    public async updateStickyNotePosition(id: number, update: StickyNotePositionUpdate): Promise<StickyNote> {
        const url = appConfig.updateStickyNotePositionUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.patch<StickyNote>(url, update);
            return response.data;
        } catch (error) {
            console.error(`Error updating sticky note position with ID ${id}:`, error);
            throw error;
        }
    }

    // עדכון גודל פתק
    public async updateStickyNoteSize(id: number, update: StickyNoteSizeUpdate): Promise<StickyNote> {
        const url = appConfig.updateStickyNoteSizeUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.patch<StickyNote>(url, update);
            return response.data;
        } catch (error) {
            console.error(`Error updating sticky note size with ID ${id}:`, error);
            throw error;
        }
    }

    // עדכון צבע פתק
    public async updateStickyNoteColor(id: number, update: StickyNoteColorUpdate): Promise<StickyNote> {
        const url = appConfig.updateStickyNoteColorUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.patch<StickyNote>(url, update);
            return response.data;
        } catch (error) {
            console.error(`Error updating sticky note color with ID ${id}:`, error);
            throw error;
        }
    }

    // מחיקת פתק
    public async deleteStickyNote(id: number): Promise<{ success: boolean, message: string }> {
        const url = appConfig.deleteStickyNoteUrl.replace(':id', id.toString());
        
        try {
            const response = await axios.delete<{ success: boolean, message: string }>(url);
            console.log("Sticky note deleted successfully.");
            return response.data;
        } catch (error) {
            console.error(`Error deleting sticky note with ID ${id}:`, error);
            throw error;
        }
    }

    // פונקציה לעיכוב (debounce) לשמירה אוטומטית
    private debounceTimers: { [key: number]: NodeJS.Timeout } = {};

    public debouncedUpdateContent(id: number, update: StickyNoteContentUpdate, delay: number = 500): Promise<StickyNote> {
        return new Promise((resolve, reject) => {
            // ביטול הטיימר הקודם אם קיים
            if (this.debounceTimers[id]) {
                clearTimeout(this.debounceTimers[id]);
            }

            // יצירת טיימר חדש
            this.debounceTimers[id] = setTimeout(async () => {
                try {
                    const result = await this.updateStickyNoteContent(id, update);
                    delete this.debounceTimers[id];
                    resolve(result);
                } catch (error) {
                    delete this.debounceTimers[id];
                    reject(error);
                }
            }, delay);
        });
    }
}

const stickyNotesService = new StickyNotesService();

export default stickyNotesService;