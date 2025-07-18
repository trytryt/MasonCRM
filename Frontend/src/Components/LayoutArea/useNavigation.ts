import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { authStore } from "../../Redux/AuthState";
import { toast } from "react-toastify";
import appConfig from "../../Utils/Config";

export const useNavigation = () => {
    const navigate = useNavigate();

    // בדיקת הרשאות משתמש
    const checkAuth = useCallback(() => {
        const user = authStore.getState().user;
        if (!user) {
            toast.error("יש להתחבר למערכת");
            navigate(appConfig.routes.login);
            return false;
        }
        return true;
    }, [navigate]);

    // ניווט לדף הבית
    const goHome = useCallback(() => {
        navigate(appConfig.routes.dashboard);
    }, [navigate]);

    // ניווט לרשימת לקוחות
    const goToCustomers = useCallback(() => {
        if (checkAuth()) {
            navigate(appConfig.routes.customers);
        }
    }, [navigate, checkAuth]);

    // ניווט להוספת לקוח חדש
    const goToNewCustomer = useCallback(() => {
        if (checkAuth()) {
            navigate(appConfig.routes.customerNew);
        }
    }, [navigate, checkAuth]);

    // ניווט לצפייה בלקוח
    const goToCustomer = useCallback((customerId: number) => {
        if (checkAuth() && customerId) {
            navigate(appConfig.routes.customerView(customerId));
        }
    }, [navigate, checkAuth]);

    // ניווט לעריכת לקוח
    const goToEditCustomer = useCallback((customerId: number) => {
        if (checkAuth() && customerId) {
            navigate(appConfig.routes.customerEdit(customerId));
        }
    }, [navigate, checkAuth]);

    // ניווט לניהול ספקים
    const goToSuppliers = useCallback(() => {
        if (checkAuth()) {
            navigate(appConfig.routes.suppliers);
        }
    }, [navigate, checkAuth]);

    // ניווט לדוחות
    const goToReports = useCallback(() => {
        if (checkAuth()) {
            navigate(appConfig.routes.balanceReport);
        }
    }, [navigate, checkAuth]);

    // ניווט לתזכורות
    const goToNotes = useCallback(() => {
        if (checkAuth()) {
            navigate(appConfig.routes.notes);
        }
    }, [navigate, checkAuth]);

    // ניווט להתחברות
    const goToLogin = useCallback(() => {
        navigate(appConfig.routes.login);
    }, [navigate]);

    // ניווט להרשמה
    const goToRegister = useCallback(() => {
        navigate(appConfig.routes.register);
    }, [navigate]);

    // ניווט עם בדיקת הרשאות כללית
    const navigateWithAuth = useCallback((path: string) => {
        if (checkAuth()) {
            navigate(path);
        }
    }, [navigate, checkAuth]);

    // חזרה לדף הקודם
    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return {
        // פונקציות ניווט ספציפיות
        goHome,
        goToCustomers,
        goToNewCustomer,
        goToCustomer,
        goToEditCustomer,
        goToSuppliers,
        goToReports,
        goToNotes,
        goToLogin,
        goToRegister,
        
        // פונקציות כלליות
        navigateWithAuth,
        goBack,
        checkAuth,
        
        // הניווט הבסיסי
        navigate
    };
};