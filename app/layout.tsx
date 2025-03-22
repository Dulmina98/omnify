// app/layout.tsx
import type {Metadata} from "next";
import {Urbanist} from "next/font/google";
import "./globals.css";
import {NavigationBar} from "@/app/components/navigation/navigation-bar";
import {Footer} from "@/app/components/navigation/footer";
import {ClerkProvider} from "@clerk/nextjs";
import {ConvexClientProvider} from "./ConvexClientProvider";
import Providers from "@/app/providers";
import WalletCheckWrapper from "@/app/components/wrappers/wallet-check-wrapper";

const urbanist = Urbanist({
    variable: "--font-urbanist",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Omnify",
    description: "The Future of Gaming Tournaments",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <ConvexClientProvider>
                <Providers>
                    <html lang="en">
                    <body
                        className={`${urbanist.variable} antialiased bg-black`}
                        style={{fontFamily: urbanist.style.fontFamily}}
                    >
                    <NavigationBar/>
                    {children}
                    <Footer/>
                    <WalletCheckWrapper/>
                    </body>
                    </html>
                </Providers>
            </ConvexClientProvider>
        </ClerkProvider>
    );
}