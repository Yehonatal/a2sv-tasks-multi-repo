"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleAutoLogin = async () => {
    setIsLoading(true);
    setError(null);

    const result = await signIn("akillogin", {
      redirect: false,
      email: "niyix60067@lisoren.com",
      password: "1234",
    });

    setIsLoading(false);

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "Automatic login failed. Check credentials or backend." : result.error);
    } else if (result?.ok) {
      router.push("/"); 
      router.refresh();
    } else {
      setError("An unknown error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Jobs Portal
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <div>
            <button
              type="button"
              onClick={handleAutoLogin}
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login to Dev Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
