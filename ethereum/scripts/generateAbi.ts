import {readFileSync, writeFileSync} from "fs";
import path from "path";

export function generateAbi() {
    const artifactPath = path.join(
        __dirname,
        "../artifacts/contracts/TournamentPayment.sol/TournamentPayment.json" // Corrected path
    );

    const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));
    const abi = artifact.abi;

    const outputPath = path.join(
        __dirname,
        "../../types/TournamentPaymentABI.ts" // Ensure correct output path
    );

    writeFileSync(
        outputPath,
        `/* Auto-generated file - DO NOT EDIT */\n` +
        `export const tournamentPaymentABI = ${JSON.stringify(abi, null, 2)} as const;\n`
    );
}