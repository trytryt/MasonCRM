import Joi from "joi";

class StickyNoteModel {
    public id: number;
    public title: string;
    public content: string;
    public color: string;
    public position_x: number;
    public position_y: number;
    public width: number;
    public height: number;
    public created_at: Date;
    public updated_at: Date;
    public is_deleted: boolean;

    public constructor(note: Partial<StickyNoteModel>) {
        this.id = note.id;
        this.title = note.title || "";
        this.content = note.content || "";
        this.color = note.color || "#ffeb3b"; // צהוב ברירת מחדל
        this.position_x = note.position_x || 0;
        this.position_y = note.position_y || 0;
        this.width = note.width || 200;
        this.height = note.height || 200;
        this.created_at = note.created_at || new Date();
        this.updated_at = note.updated_at || new Date();
        this.is_deleted = note.is_deleted || false;
    }

    private static validationSchema = Joi.object({
        id: Joi.number().optional().allow(null),
        title: Joi.string().optional().allow("").max(100),
        content: Joi.string().optional().allow("").max(5000),
        color: Joi.string().optional().pattern(/^#[0-9A-Fa-f]{6}$/), // צבע hex
        position_x: Joi.number().optional().min(0).max(5000),
        position_y: Joi.number().optional().min(0).max(5000),
        width: Joi.number().optional().min(100).max(800),
        height: Joi.number().optional().min(100).max(800),
        created_at: Joi.date().optional(),
        updated_at: Joi.date().optional(),
        is_deleted: Joi.boolean().optional()
    });

    public validate(): string {
        const result = StickyNoteModel.validationSchema.validate(this);
        return result.error?.message;
    }
}

export default StickyNoteModel;