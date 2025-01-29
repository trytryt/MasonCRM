import React, { useState } from "react";
import axios from "axios";

interface FileUploadProps {
    customerId?: number;
}


export function FileUpload(customerId: FileUploadProps): JSX.Element {
    const [file, setFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            alert("Please select a file to upload");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`http://localhost:3002/api/customer/${customerId}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                // onUploadProgress: (progressEvent) => {
                //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                //     setUploadProgress(progress);
                // },
            });

            console.log("File path from server: ", response.data.filePath);
        } catch (error: any) {
            console.log(`Error uploading file: ${error.message}`);
        } finally {
            setUploadProgress(0);
            setFile(null);
        }
    };

    return (
        <div>
            {/*<h3>Upload a File</h3>*/}
            <form onSubmit={handleFileUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" disabled={!file}>
                    העלאה
                </button>
            </form>
            {uploadProgress > 0 && <p>Uploading... {uploadProgress}%</p>}
        </div>
    );
}
