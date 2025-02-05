"use client";

import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convert-to-subcurrency";
import {CheckoutForm} from "@/app/checkout/components/checkout-form";
import {useSearchParams} from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
    const searchParams = useSearchParams();
    const amount = parseFloat(searchParams.get("amount") || "0");
    const role = searchParams.get("role") || "";
    const tournamentId = searchParams.get("tournamentId");
    const type = searchParams.get("type") || "unknown";

    if (!tournamentId) return null;

    return (
        <div
            className={"min-h-screen w-full flex flex-col justify-center items-center bg-[url(/assets/images/bg/general-bg.jpg)] bg-cover bg-no-repeat"}>
            <div className={"text-[64px] text-white text-center w-full"}>
                Join the <span className={"text-theme-crimson"}>Action</span>
            </div>
            <div className={"text-white text-center text-[32px] max-w-[675px] w-full mx-auto mb-[100px]"}>
                Join the ultimate blockchain-powered tournaments and rise to the top!
            </div>
            <div className={"mb-20"}>
                <Elements stripe={stripePromise} options={{
                    mode: "payment",
                    amount: convertToSubcurrency(amount),
                    currency: "usd"
                }}>
                    <CheckoutForm amount={amount} tournamentId={tournamentId} role={role} type={type}/>
                </Elements>
            </div>
        </div>
    )
}