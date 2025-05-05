import { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import { ToastProps } from "../types/ToastProps";

// Define Shape
interface ToastContextType {
    toast: ToastProps | null;
    showToast: (message: string, type: ToastProps["type"]) => void;
    hideToast: () => void;
}

// Create a default value for the context
const defaultToastContextValue: ToastContextType = {
    toast: null,
    showToast: () => {},
    hideToast: () => {}
};

export const ToastContext = createContext<ToastContextType>(defaultToastContextValue);

// Toast reducer for state management
type ToastAction = 
  | { type: 'SHOW_TOAST'; payload: { message: string; toastType: ToastProps["type"] } }
  | { type: 'HIDE_TOAST' };

const toastReducer = (state: ToastProps | null, action: ToastAction): ToastProps | null => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return { message: action.payload.message, type: action.payload.toastType };
    case 'HIDE_TOAST':
      return null;
    default:
      return state;
  }
};

// Provider component
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, dispatch] = useReducer(toastReducer, null);

    // Show a toast notification
    const showToast = useCallback(
        (message: string, type: ToastProps["type"]) => {
            dispatch({ type: 'SHOW_TOAST', payload: { message, toastType: type } });

            setTimeout(() => {
                dispatch({ type: 'HIDE_TOAST' });
            }, 3000);
        },
        []
    );

    const hideToast = useCallback(() => {
        dispatch({ type: 'HIDE_TOAST' });
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast context
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
