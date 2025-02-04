"use client";

import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import convertToSubcurrency from "@/lib/convert-to-subcurrency";
import {CheckoutForm} from "@/app/checkout/components/checkout-form";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Checkout() {
    const amount = 49.99;

    return (
        <Elements stripe={stripePromise} options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd"
        }}>
            <CheckoutForm amount={amount}/>
        </Elements>
    )
}