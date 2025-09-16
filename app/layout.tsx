import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Poppins } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import localFont from 'next/font/local'

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/display/ScrollToTop";

const nasalization = localFont({
    variable: "--font-nasalization",
    src: "../public/assets/fonts/nasalization-rg.ttf",
    display: "swap",
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
    variable: "--font-zen-kaku-gothic-new",
    weight: ["500", "700"],
    subsets: ["latin"],
});

const poppins = Poppins({
    variable: "--font-poppins",
    weight: ["500", "600", "700"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SKILL SYNC",
    description: "SKILL SYNC | スキルをシェアする時代へ",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ja">
            <body 
                className={`${nasalization.variable} ${zenKakuGothicNew.variable} ${poppins.variable}`}
            >
                {/* <SessionProvider> */}
                    {/* <Header /> */}
                    <main>
                        {children}
                        <Toaster 
                            position="top-center"
                            containerClassName="toast"
                        />
                    </main>
                    {/* <Footer /> */}
                    {/* <ScrollToTop /> */}
                {/* </SessionProvider> */}
            </body>
        </html>
    );
}
