"use client";

import React from "react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "@/components/ui/accordion";
import Image from "next/image";

// Object for "Getting Started" card
const gettingStarted = {
    title: "Getting Started",
    items: [
        {
            question: "How do I create an account?",
            answer:
                "1. Navigate to the homepage and click 'Sign Up'.\n2. Enter your details (email, password, etc.) and submit the form.\n3. Verify your email if prompted.\n4. Log in using your credentials to access the platform.",
        },
        {
            question: "How do I become a member (Player or Organizer)?",
            answer:
                "1. After signing up, go to the 'Become a Member' page.\n2. To become a Player: Select the 'Become a Player' tab, fill out the form, and submit.\n3. To become an Organizer: Select the 'Become an Organizer' tab, fill out the form, and submit.\n4. Connect your wallet to join tournaments (as a Player) or create tournaments (as an Organizer).",
        },
        {
            question: "How do I connect my wallet?",
            answer:
                "1. Click 'Connect Wallet' in the header or profile section.\n2. Ensure MetaMask or another Ethereum wallet is installed.\n3. Select your wallet provider and approve the connection.\n4. Your wallet address will appear once connected, enabling transactions like paying entry fees or creating tournaments.",
        },
    ],
};

// Object for "Blockchain and Wallets" card
const blockchainAndWallets = {
    title: "Blockchain and Wallets",
    items: [
        {
            question: "What is a smart contract?",
            answer:
                "A smart contract is a self-executing program on the Ethereum blockchain. It automates tournament tasks like verifying match results and distributing prizes, ensuring transparency and fairness without intermediaries.",
        },
        {
            question: "Why do I need a wallet?",
            answer:
                "A wallet (e.g., MetaMask) is required to interact with the blockchain. It lets you pay entry fees in ETH, receive prizes, and securely sign transactions.",
        },
        {
            question: "How do I check my transaction history?",
            answer:
                "1. Visit a blockchain explorer like Etherscan.\n2. Enter your wallet address or transaction hash from the platform.\n3. View all recorded actions, such as entry fee payments or prize claims.",
        },
    ],
};

// Object for "Support" card
const support = {
    title: "Support",
    items: [
        {
            question: "How do I contact support?",
            answer:
                "Email us at ssupport@omnify.com or join our Discord community for assistance. Include details like your wallet address or tournament ID for faster help.",
        },
        {
            question: "What if I encounter an issue (e.g., transaction failure)?",
            answer:
                "1. Check your wallet for error messages (e.g., insufficient ETH for gas).\n2. Retry the action if needed.\n3. Contact support if the issue persists, providing transaction details.",
        },
    ],
};

export default function FAQ() {
    return (
        <div className="w-full min-h-screen h-full relative">
            <Image
                src="/assets/images/bg/general-bg.jpg"
                alt="contact-bg"
                className="absolute top-0 left-0 h-full z-10 opacity-40 object-cover"
                width={4000}
                height={3000}
            />
            <div
                className={" w-full h-full absolute top-0 left-0 z-0"}/>
            <div className="max-w-[1800px] w-full px-6 lg:px-[100px] py-[150px] mx-auto relative z-10">
                <h1 className="text-[45px] md:text-[64px] text-white text-center w-full mb-4">
                    Frequently Asked{" "}
                    <span className="text-theme-crimson">Questions</span>
                </h1>
                <p className="text-[25px] md:text-[32px] text-white text-center max-w-[675px] w-full mx-auto mb-[140px]">
                    Find answers to common questions about our blockchain-powered
                    tournament system.
                </p>
                <div className=" p-6  backdrop-blur-xl bg-black/20 bg-black/20">
                    <h2 className="font-medium text-[30px] text-theme-crimson w-full pb-[20px] border-b border-b-muted-gray mb-[45px]">
                        {gettingStarted.title}
                    </h2>
                    <Accordion type="single" collapsible>
                        {gettingStarted.items.map((item, idx) => (
                            <AccordionItem
                                key={idx}
                                value={`getting-started-${idx}`}
                                className="border-b border-gray-700"
                            >
                                <AccordionTrigger
                                    className="text-left text-lg font-medium text-white py-2 hover:text-theme-crimson">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent
                                    className="text-gray-300 py-2 whitespace-pre-line text-[16px] leading-8">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div className="xl:flex gap-[20px] w-full mt-[20px]">
                    {/* Blockchain and Wallets Card */}
                    <div className="flex-1  p-6  backdrop-blur-xl bg-black/20">
                        <h2 className="font-medium text-[30px] text-theme-crimson w-full pb-[20px] border-b border-b-muted-gray mb-[45px]">
                            {blockchainAndWallets.title}
                        </h2>
                        <Accordion type="single" collapsible>
                            {blockchainAndWallets.items.map((item, idx) => (
                                <AccordionItem
                                    key={idx}
                                    value={`blockchain-${idx}`}
                                    className="border-b border-gray-700"
                                >
                                    <AccordionTrigger
                                        className="text-left text-lg font-medium text-white py-2 hover:text-theme-crimson">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent
                                        className="text-gray-300 py-2 whitespace-pre-line text-[16px] leading-8">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    {/* Support Card */}
                    <div className="flex-1  p-6  backdrop-blur-xl bg-black/20">
                        <h2 className="font-medium text-[30px] text-theme-crimson w-full pb-[20px] border-b border-b-muted-gray mb-[45px]">
                            {support.title}
                        </h2>
                        <Accordion type="single" collapsible>
                            {support.items.map((item, idx) => (
                                <AccordionItem
                                    key={idx}
                                    value={`support-${idx}`}
                                    className="border-b border-gray-700"
                                >
                                    <AccordionTrigger
                                        className="text-left text-lg font-medium text-white py-2 hover:text-theme-crimson">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent
                                        className="text-gray-300 py-2 whitespace-pre-line text-[16px] leading-8">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}