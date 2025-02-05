"use client";

import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {api} from "@/convex/_generated/api";
import {useApiMutation} from "@/hooks/use-api-mutation";
import {useCurrentUser} from "@/services/user-service";
import Image from "next/image";
import {useQuery} from "convex/react";
import {Id} from "@/convex/_generated/dataModel";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function PaymentSuccess() {
    const searchParams = useSearchParams();
    const amount = searchParams.get("amount");
    const tournamentId = searchParams.get("tournamentId");
    const role = searchParams.get("role");
    const paymentIntent = searchParams.get("payment_intent");
    const paymentType = searchParams.get("type")
    const {user} = useCurrentUser();
    const tournament = useQuery(api.tournaments.getTournamentById, {tournamentId: tournamentId as Id<"tournaments">})

    const {mutate} = useApiMutation(api.transactions.createTransaction);

    useEffect(() => {
        async function recordTransaction() {
            try {
                if (!user || !tournamentId || !amount || !role || !paymentIntent) {
                    console.warn("Missing required data; transaction not recorded.");
                    return;
                }

                const storageKey = `transactionRecorded_${paymentIntent}`;

                const recordedStatus = sessionStorage.getItem(storageKey);
                if (recordedStatus === "pending" || recordedStatus === "true") {
                    console.log("Transaction for this payment intent has already been recorded or is in progress.");
                    return;
                }

                sessionStorage.setItem(storageKey, "pending");

                console.log("Recording transaction for payment intent:", paymentIntent);
                await mutate({
                    tournamentId,
                    userId: user.userId,
                    amount: Number(amount),
                    role: role,
                    type: paymentType,
                });
                console.log("Transaction recorded successfully.");

                sessionStorage.setItem(storageKey, "true");
            } catch (error) {
                console.error("Failed to record transaction:", error);
                const storageKey = `transactionRecorded_${paymentIntent}`;
                sessionStorage.removeItem(storageKey);
            }
        }

        recordTransaction();
    }, [user, tournamentId, amount, role, paymentIntent, mutate]);

    return (
        <div
            className={"min-h-screen flex flex-col justify-center items-center bg-[url(/assets/images/bg/general-bg.jpg)] bg-cover bg-no-repeat"}>
            <div
                className={"max-w-[600px] w-full rounded-[10px] border border-outline-gray bg-black/30 backdrop-blur-lg p-[40px] flex flex-col justify-center items-center text-white"}>
                <Image src={"/assets/images/icons/checked.png"} alt={"check"} width={50} height={50}
                       className={"mb-8"}/>
                <div className={"text-[40px]"}>Payment <span className={"text-theme-crimson"}>Successful!</span></div>
                <div className={"mt-2"}>Thank you for your payment, {user?.firstName} {user?.lastName}.</div>
                <div className={"mt-8"}>
                    <div className={"text-white text-center text-[20px] font-semibold mb-3"}>More information</div>
                    <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Tournament name:</span> {tournament?.tournamentName}
                    </li>
                    <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Amount: </span> {amount}
                    </li>
                    <li className={"text-white text-[16px]"}>
                                    <span
                                        className={"font-semibold"}>Payment type: </span> {paymentType}
                    </li>
                </div>
                <Link href={"/user-profile"} className={"w-full mt-16"}>
                    <Button className={"w-full text-[16px] h-[46px]"} variant={"secondary"}>Back to Dashboard</Button>
                </Link>
            </div>

        </div>
    );
}