import React, { useState, useEffect } from 'react';
import { StickyNote as StickyNoteModel } from '../../../Models/sticky_notes_models';
import stickyNotesService from '../../../Services/sticky_notes_service';
import { notify } from '../../../Utils/Notify';
import StickyNote from './sticky_note_component';
import './StickyNotesBoard.css';
const StickyNotesBoard: React.FC = () => {
    const [notes, setNotes] = useState<StickyNoteModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // טעינת פתקים
    const loadNotes = async () => {
        setLoading(true);
        try {
            const loadedNotes = await stickyNotesService.getAllStickyNotes();
            setNotes(loadedNotes);
        } catch (error) {
            notify.error('שגיאה בטעינת הפתקים');
        } finally {
            setLoading(false);
        }
    };

    // טעינה ראשונית
    useEffect(() => {
        loadNotes();
    }, []);

    // הוספת פתק חדש
    const handleAddNote = async () => {
        try {
            const newNote = await stickyNotesService.createNewStickyNote();
            setNotes(prev => [...prev, newNote]);
            notify.success('פתק חדש נוצר');
        } catch (error) {
            notify.error('שגיאה ביצירת פתק חדש');
        }
    };

    // עדכון פתק
    const handleUpdateNote = (updatedNote: StickyNoteModel) => {
        setNotes(prev => prev.map(note => 
            note.id === updatedNote.id ? updatedNote : note
        ));
    };

    // מחיקת פתק
    const handleDeleteNote = (id: number) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    };

    // רענון הפתקים
    const handleRefresh = () => {
        loadNotes();
    };

    // מחיקת כל הפתקים (עם אישור)
    const handleClearAll = async () => {
        if (notes.length === 0) {
            notify.info('אין פתקים למחיקה');
            return;
        }

        if (window.confirm(`האם אתה בטוח שברצונך למחוק את כל ${notes.length} הפתקים?`)) {
            try {
                // מחיקת כל הפתקים אחד אחד
                await Promise.all(notes.map(note => 
                    stickyNotesService.deleteStickyNote(note.id)
                ));
                
                setNotes([]);
                notify.success('כל הפתקים נמחקו בהצלחה');
            } catch (error) {
                notify.error('שגיאה במחיקת הפתקים');
                // רענון למקרה שחלק נמחקו
                loadNotes();
            }
        }
    };

    return (
        <div className="sticky-notes-board">
            {/* כלי עבודה */}
            <div className="board-toolbar">
                <div className="toolbar-left">
                    <h2>תזכורות</h2>
                    <span className="notes-count">({notes.length} פתקים)</span>
                </div>
                
                <div className="toolbar-right">
                    <button 
                        className="btn btn-primary"
                        onClick={handleAddNote}
                        title="הוסף פתק חדש"
                    >
                        + פתק חדש
                    </button>
                    
                    <button 
                        className="btn btn-secondary"
                        onClick={handleRefresh}
                        title="רענן פתקים"
                    >
                        🔄 רענן
                    </button>
                    
                    {notes.length > 0 && (
                        <button 
                            className="btn btn-danger"
                            onClick={handleClearAll}
                            title="מחק את כל הפתקים"
                        >
                            🗑️ מחק הכל
                        </button>
                    )}
                </div>
            </div>

            {/* אזור הפתקים */}
            <div className="board-container">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>טוען פתקים...</p>
                    </div>
                ) : notes.length === 0 ? (
                    <div className="empty-board">
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>אין תזכורות עדיין</h3>
                            <p>לחץ על "פתק חדש" כדי להתחיל</p>
                        </div>
                    </div>
                ) : (
                    <div className="notes-container">
                        {notes.map(note => (
                            <StickyNote
                                key={note.id}
                                note={note}
                                onUpdate={handleUpdateNote}
                                onDelete={handleDeleteNote}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* הוראות שימוש */}
            {notes.length > 0 && (
                <div className="usage-instructions">
                    <p>💡 טיפים: גרור פתקים להזזה • שנה גודל עם הידית בפינה • עריכה אוטומטית בזמן הקלדה</p>
                </div>
            )}
        </div>
    );
};

export default StickyNotesBoard;
