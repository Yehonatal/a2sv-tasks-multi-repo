import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import NextAuthProvider from "@/providers/SessionProvider";
import Header from "@/components/Header";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Job Listings",
    description: "Find the latest job opportunities and career openings",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} bg-gray-50 min-h-screen`}
                suppressHydrationWarning
            >
                <ReduxProvider>
                    <NextAuthProvider>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="max-w-screen-xl mx-auto lg:p-8 flex-grow">
                                {children}
                            </main>
                        </div>
                    </NextAuthProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
