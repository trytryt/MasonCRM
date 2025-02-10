declare global {
    namespace Express {
        interface Request {
            uploadedFile?: {
                customerId: number;
                filePath: string;
                fileName: string;
                originalName: string;
                mimetype: string;
                size: number;
            };
        }
    }
}
