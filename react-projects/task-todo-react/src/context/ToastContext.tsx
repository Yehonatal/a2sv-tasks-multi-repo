import { createContext, useState, ReactNode, useCallback } from "react";
import { ToastProps } from "../types/ToastProps";

// Define Shape
interface ToastContextType {
    toast: ToastProps | null;
    showToast: (message: string, type: ToastProps["type"]) => void;
    hideToast: () => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
    undefined
);

// Provider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<ToastProps | null>(null);

    // Show a toast notification
    const showToast = useCallback(
        (message: string, type: ToastProps["type"]) => {
            setToast({ message, type });

            setTimeout(() => {
                setToast(null);
            }, 3000);
        },
        []
    );

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};
