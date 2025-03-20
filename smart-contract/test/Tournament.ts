import {expect} from "chai";
import {ethers} from "hardhat";
import {Tournament} from "../typechain-types";

describe("Tournament", () => {
    let tournament: Tournament;
    let owner: any, player1: any, player2: any, sponsor: any;
    const entryFee = ethers.parseEther("0.1"); // 0.1 ETH

    beforeEach(async () => {
        [owner, player1, player2, sponsor] = await ethers.getSigners();
        const TournamentFactory = await ethers.getContractFactory("Tournament");
        tournament = (await TournamentFactory.deploy(entryFee)) as Tournament;
        await tournament.waitForDeployment();
    });

    it("should allow players to pay entry fee", async () => {
        await tournament.connect(player1).payEntryFee({value: entryFee});
        expect(await tournament.paidPlayers(player1.address)).to.be.true;
        expect(await ethers.provider.getBalance(tournament.target)).to.equal(entryFee);
    });

    it("should accept contributions", async () => {
        const contribution = ethers.parseEther("1");
        await tournament.connect(sponsor).contribute({value: contribution});
        expect(await ethers.provider.getBalance(tournament.target)).to.equal(contribution);
    });

    it("should distribute prizes", async () => {
        await tournament.connect(player1).payEntryFee({value: entryFee});
        await tournament.connect(player2).payEntryFee({value: entryFee});
        const winners = [player1.address, player2.address];
        const amounts = [ethers.parseEther("0.15"), ethers.parseEther("0.05")];
        await tournament.connect(owner).distributePrizes(winners, amounts);
        expect(await tournament.status()).to.equal(1); // Distributed
    });

    it("should cancel and refund", async () => {
        await tournament.connect(player1).payEntryFee({value: entryFee});
        const initialBalance = await ethers.provider.getBalance(player1.address);
        await tournament.connect(owner).cancelTournament();
        const newBalance = await ethers.provider.getBalance(player1.address);
        expect(newBalance).to.be.above(initialBalance); // Refund received
    });
});