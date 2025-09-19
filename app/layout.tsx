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

const zenKakuGothicNew = localFont({
    variable: "--font-zen",
    src: [
        {
            path: "../public/assets/fonts/zenkaku-gothic-new-medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../public/assets/fonts/zenkaku-gothic-new-bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    display: "swap",
    preload: true,
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
        <html lang="ja">
            <body 
                className={`${nasalization.variable} ${zenKakuGothicNew.variable} ${poppins.variable}`}
            >
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
    )
}
