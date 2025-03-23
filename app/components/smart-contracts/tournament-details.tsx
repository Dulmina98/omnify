"use client";

import {useEffect, useState} from "react";
import {fetchTournamentData} from "@/lib/contract";

interface TournamentDetailsProps {
    contractAddress: string;
}

interface TournamentData {
    entryFee: string;
    totalPrizePool: string;
    numberOfPlayersRequired: number;
    startDate: number;
    endDate: number;
    organizer: string;
    status: number;
    prizeDistributionMethod: number;
}

export default function TournamentDetails({contractAddress}: TournamentDetailsProps) {
    const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!contractAddress) {
                setError("No contract address provided.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await fetchTournamentData(contractAddress);
                setTournamentData(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch tournament data.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [contractAddress]);

    if (loading) {
        return <div className="text-white">Loading tournament data...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!tournamentData) {
        return <div className="text-white">No data available.</div>;
    }

    const statusLabels = ["Ongoing", "Distributed", "Canceled"];
    const prizeMethodLabels = ["Winner Takes All", "Top 3"];

    return (
        <div className="bg-black/75 backdrop-blur-lg border border-muted-gray rounded-[10px] p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Tournament Details (On-Chain)</h3>
            <div className="space-y-2">
                <p>
                    <strong>Contract Address:</strong> {contractAddress}
                </p>
                <p>
                    <strong>Entry Fee:</strong> {tournamentData.entryFee} ETH
                </p>
                <p>
                    <strong>Total Prize Pool:</strong> {tournamentData.totalPrizePool} ETH
                </p>
                <p>
                    <strong>Organizer:</strong> {tournamentData.organizer}
                </p>
                <p>
                    <strong>Start Date:</strong>{" "}
                    {new Date(tournamentData.startDate * 1000).toLocaleString()}
                </p>
                <p>
                    <strong>End Date:</strong>{" "}
                    {new Date(tournamentData.endDate * 1000).toLocaleString()}
                </p>
                <p>
                    <strong>Players Required:</strong> {tournamentData.numberOfPlayersRequired}
                </p>
                <p>
                    <strong>Prize Distribution:</strong>{" "}
                    {prizeMethodLabels[tournamentData.prizeDistributionMethod]}
                </p>
                <p>
                    <strong>Status:</strong> {statusLabels[tournamentData.status]}
                </p>
            </div>
            <p className="text-sm text-gray-400 mt-4">
                Data fetched directly from the blockchain for maximum transparency.
            </p>
        </div>
    );
}