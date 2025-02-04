"use client";

import {PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {useEffect, useState} from "react";
import convertToSubcurrency from "@/lib/convert-to-subcurrency";
import {Button} from "@/components/ui/button";

type CheckoutProps = {
    amount: number
}

export function CheckoutForm({amount}: CheckoutProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/stripe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({amount: convertToSubcurrency(amount)}),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret));
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            return;
        }

        const {error: submitError} = await elements.submit();

        if (submitError) {
            setErrorMessage(submitError.message);
            setLoading(false);
            return;
        }

        const {error} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `http://www.localhost:3000/payment-success?amount=${amount}`,
            },
        });

        if (error) {
            setErrorMessage(error.message);
        } else {
        }

        setLoading(false);
    };

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
          <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
                </div>
            </div>
        );
    }

    return (
        <div className={"py-40 px-[500px]"}>
            <div className={"bg-white p-10 rounded-xl"}>
                <form onSubmit={handleSubmit}>
                    {clientSecret && <PaymentElement/>}
                    <Button disabled={!stripe || loading} variant={"secondary"}
                            className={"text-black mt-8"}>{!loading ? `Pay $${amount}` : "Processing..."}</Button>
                </form>
            </div>
        </div>
    )
}