import type { Metadata } from "next"
import { Zen_Kaku_Gothic_New, Poppins } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"

import "./globals.css";
import localFont from "next/font/local"

export const dynamic = "force-dynamic"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ScrollToTop from "@/components/common/display/ScrollToTop"

const nasalization = localFont({
    variable: "--font-nasalization",
    src: "../public/assets/fonts/nasalization-rg.ttf",
    display: "swap",
    preload: true,
});

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
    variable: "--font-zen",
    weight: ["500", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
    fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'sans-serif'],
});

const poppins = Poppins({
    variable: "--font-poppins",
    weight: ["500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: "SKILL SYNC",
    description: "SKILL SYNC | スキルをシェアする時代へ",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html 
            lang="ja"
            className={`${nasalization.variable} ${zenKakuGothicNew.variable} ${poppins.variable}`}
        >
            <body>
                <SessionProvider>
                    <Header />
                    <main>
                        {children}
                        <Toaster 
                            position="top-center"
                            containerClassName="toast"
                        />
                    </main>
                    <Footer />
                    <ScrollToTop />
                </SessionProvider>
            </body>
        </html>
    );
}
