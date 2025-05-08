// Authentication utility functions


/**
 * Retrieves the user token from localStorage
 * @returns The stored token or null if not found
 */
export const getUserToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("userToken");
    }
    return null;
};




// Default demo token for testing purposes (only used as fallback)
export const DEMO_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjJkZGJiNzYwOGQ5MzM2ZTI3NjRiYSIsImlhdCI6MTcxMDQxNzM1NSwiZXhwIjoxNzEzMDA5MzU1fQ.Nh8XVwY9LZ-QTmIIZQtDOl9Z-mGPwn1KGUQlLGXc-Oc";
