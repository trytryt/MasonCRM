import Joi from 'joi'

class DocumentModel {
    public documentId: number | null
    public customerId: number
    public documentName: string
    public filePath: string
    public uploadDate: string

    // Update constructor to accept partial object
    public constructor(document: Partial<DocumentModel>) {
        this.documentId = document.documentId ?? null; // Default to null
        this.customerId = document.customerId;
        this.documentName = document.documentName;
        this.filePath = document.filePath;
        this.uploadDate = document.uploadDate;
    }

    private static validationSchema = Joi.object({
        documentId: Joi.number().optional().allow(null),
        customerId: Joi.number(),
        documentName: Joi.string().required().min(2),
        filePath: Joi.string().required().min(2),
        uploadDate: Joi.string().required(),
    });

    public validate(): string {
        const result = DocumentModel.validationSchema.validate(this);
        return result.error?.message || '';
    }
}

export default DocumentModel;
