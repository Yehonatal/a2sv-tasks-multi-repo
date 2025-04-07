import { useToast } from "../hooks/useToast";

const Toast = () => {
    const { toast } = useToast();

    if (!toast) return null;

    return (
        <div id="toast" className={`toast toast--show toast--${toast.type}`}>
            {toast.message}
        </div>
    );
};

export default Toast;
