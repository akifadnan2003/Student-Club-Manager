import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Uluforeigns Admin",
    description: "ISC Administration Portal",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`bg-ulu-bg text-ulu-text-primary antialiased`}>{children}</body>
        </html>
    );
}
