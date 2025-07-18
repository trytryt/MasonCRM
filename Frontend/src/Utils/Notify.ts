// src/Utils/Notify.ts
import { toast } from 'react-toastify';

class NotifyService {
    public success(message: string): void {
        toast.success(message);
    }

    public error(message: string): void {
        toast.error(message);
    }

    public info(message: string): void {
        toast.info(message);
    }

    public warning(message: string): void {
        toast.warn(message);
    }
}

const notify = new NotifyService();

export { notify };