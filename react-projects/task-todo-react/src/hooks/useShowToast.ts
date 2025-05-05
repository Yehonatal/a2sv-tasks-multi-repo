import { useToast } from "../hooks/useToast";

export function useShowToast() {
    const { showToast } = useToast();

    return {
        showToast: (
            message: string,
            type: "success" | "error" | "warning" | "info"
        ) => {
            showToast(message, type);
        },
    };
}
