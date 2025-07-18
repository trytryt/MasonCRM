import React, { useState, useRef, useEffect } from 'react';
import { StickyNote as StickyNoteModel, STICKY_NOTE_COLORS } from '../../../Models/sticky_notes_models';
import stickyNotesService from '../../../Services/sticky_notes_service';
import './StickyNote.css';
import { notify } from '../../../Utils/Notify';

interface StickyNoteProps {
    note: StickyNoteModel;
    onUpdate: (updatedNote: StickyNoteModel) => void;
    onDelete: (id: number) => void;
}

const StickyNote: React.FC<StickyNoteProps> = ({ note, onUpdate, onDelete }) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [initialPosition, setInitialPosition] = useState({ x: note.position_x, y: note.position_y });
    const [dimensions, setDimensions] = useState({ width: note.width, height: note.height });

    const noteRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    // שמירה אוטומטית של תוכן
    useEffect(() => {
        if (title !== note.title || content !== note.content) {
            stickyNotesService.debouncedUpdateContent(note.id, { title, content })
                .then(updatedNote => {
                    onUpdate(updatedNote);
                })
                .catch(error => {
                    console.error('Error auto-saving note:', error);
                });
        }
    }, [title, content, note.id, note.title, note.content, onUpdate]);

    // התחלת גרירה
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === titleRef.current || e.target === contentRef.current) {
            return; // לא לגרור כשכותבים
        }

        setIsDragging(true);
        setDragStart({
            x: e.clientX - initialPosition.x,
            y: e.clientY - initialPosition.y
        });
    };

    // גרירה
    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newX = Math.max(0, e.clientX - dragStart.x);
            const newY = Math.max(0, e.clientY - dragStart.y);
            setInitialPosition({ x: newX, y: newY });
        }
    };

    // סיום גרירה
    const handleMouseUp = async () => {
        if (isDragging) {
            setIsDragging(false);
            
            // שמירת המיקום החדש
            try {
                const updatedNote = await stickyNotesService.updateStickyNotePosition(note.id, {
                    x: initialPosition.x,
                    y: initialPosition.y
                });
                onUpdate(updatedNote);
            } catch (error) {
                notify.error('שגיאה בשמירת מיקום הפתק');
            }
        }
    };

    // הוספת מאזינים לגרירה
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart, initialPosition]);

    // שינוי צבע
    const handleColorChange = async (color: string) => {
        try {
            const updatedNote = await stickyNotesService.updateStickyNoteColor(note.id, { color });
            onUpdate(updatedNote);
            setShowColorPicker(false);
        } catch (error) {
            notify.error('שגיאה בשינוי צבע הפתק');
        }
    };

    // מחיקת פתק
    const handleDelete = async () => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק פתק זה?')) {
            try {
                await stickyNotesService.deleteStickyNote(note.id);
                onDelete(note.id);
                notify.success('הפתק נמחק בהצלחה');
            } catch (error) {
                notify.error('שגיאה במחיקת הפתק');
            }
        }
    };

    // התחלת שינוי גודל
    const handleResizeStart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsResizing(true);
    };

    // שינוי גודל
    const handleResize = (e: MouseEvent) => {
        if (isResizing && noteRef.current) {
            const rect = noteRef.current.getBoundingClientRect();
            const newWidth = Math.max(150, e.clientX - rect.left);
            const newHeight = Math.max(100, e.clientY - rect.top);
            
            setDimensions({ width: newWidth, height: newHeight });
        }
    };

    // סיום שינוי גודל
    const handleResizeEnd = async () => {
        if (isResizing) {
            setIsResizing(false);
            
            try {
                const updatedNote = await stickyNotesService.updateStickyNoteSize(note.id, {
                    width: dimensions.width,
                    height: dimensions.height
                });
                onUpdate(updatedNote);
            } catch (error) {
                notify.error('שגיאה בשמירת גודל הפתק');
            }
        }
    };

    // מאזינים לשינוי גודל
    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', handleResizeEnd);
        }

        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [isResizing, dimensions]);

    return (
        <div
            ref={noteRef}
            className={`sticky-note ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''}`}
            style={{
                backgroundColor: note.color,
                left: initialPosition.x,
                top: initialPosition.y,
                width: dimensions.width,
                height: dimensions.height,
                position: 'absolute',
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
        >
            {/* כפתורי פעולה */}
            <div className="note-controls">
                <button 
                    className="color-btn"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    title="שנה צבע"
                >
                    🎨
                </button>
                <button 
                    className="delete-btn"
                    onClick={handleDelete}
                    title="מחק פתק"
                >
                    ×
                </button>
            </div>

            {/* בורר צבעים */}
            {showColorPicker && (
                <div className="color-picker">
                    {STICKY_NOTE_COLORS.map(colorOption => (
                        <button
                            key={colorOption.value}
                            className="color-option"
                            style={{ backgroundColor: colorOption.value }}
                            onClick={() => handleColorChange(colorOption.value)}
                            title={colorOption.name}
                        />
                    ))}
                </div>
            )}

            {/* כותרת */}
            <input
                ref={titleRef}
                className="note-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="כותרת..."
                onClick={(e) => e.stopPropagation()}
            />

            {/* תוכן */}
            <textarea
                ref={contentRef}
                className="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="כתוב כאן..."
                onClick={(e) => e.stopPropagation()}
            />

            {/* ידית לשינוי גודל */}
            <div 
                className="resize-handle"
                onMouseDown={handleResizeStart}
                title="שנה גודל"
            />
        </div>
    );
};

export default StickyNote;