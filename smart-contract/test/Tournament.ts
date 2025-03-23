// test/Tournament.ts
import {ethers} from "hardhat";
import {expect} from "chai";
import {Tournament} from "../typechain-types"; // Adjust based on your generated types
import {SignerWithAddress} from "@nomicfoundation/hardhat-ethers/signers";
import {time} from "@nomicfoundation/hardhat-network-helpers";
import {ContractFactory} from "ethers";

describe("Tournament Contract", function () {
    let tournamentFactory: ContractFactory;
    let tournament: Tournament;
    let organizer: SignerWithAddress;
    let player1: SignerWithAddress;
    let player2: SignerWithAddress;
    let contributor: SignerWithAddress;

    const ENTRY_FEE = ethers.parseEther("1"); // 1 ETH
    const NUM_PLAYERS = 2;
    const TOTAL_PRIZE_POOL = ethers.parseEther("5"); // 5 ETH
    const START_DATE_OFFSET = 1000; // 1000 seconds from now
    const END_DATE_OFFSET = 2000; // 2000 seconds from now

    beforeEach(async function () {
        [organizer, player1, player2, contributor] = await ethers.getSigners();

        tournamentFactory = await ethers.getContractFactory("Tournament");
        const startDate = (await time.latest()) + START_DATE_OFFSET;
        const endDate = (await time.latest()) + END_DATE_OFFSET;

        tournament = (await tournamentFactory.deploy(
            ENTRY_FEE,
            NUM_PLAYERS,
            startDate,
            endDate,
            TOTAL_PRIZE_POOL,
            0 // WinnerTakesAll
        )) as Tournament;

        await tournament.waitForDeployment();
    });

    describe("Deployment", function () {
        it("should set the organizer correctly", async function () {
            expect(await tournament.organizer()).to.equal(organizer.address);
        });

        it("should set the prize pool correctly", async function () {
            expect(await tournament.getPrizePool()).to.equal(TOTAL_PRIZE_POOL);
        });
    });

    describe("payEntryFee", function () {
        it("should allow players to pay entry fee after start date", async function () {
            await time.increase(START_DATE_OFFSET + 1); // Move past start date
            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});
            expect(await tournament.paidPlayers(player1.address)).to.equal(true);
        });

        it("should reject payment before start date", async function () {
            await expect(
                tournament.connect(player1).payEntryFee({value: ENTRY_FEE})
            ).to.be.revertedWith("Tournament not yet started");
        });

        it("should reject incorrect entry fee amount", async function () {
            await time.increase(START_DATE_OFFSET + 1);
            await expect(
                tournament.connect(player1).payEntryFee({value: ethers.parseEther("0.5")})
            ).to.be.revertedWith("Incorrect entry fee amount");
        });
    });

    describe("contribute", function () {
        it("should accept contributions", async function () {
            await tournament.connect(contributor).contribute({value: ethers.parseEther("2")});
            expect(await tournament.contributions(contributor.address)).to.equal(
                ethers.parseEther("2")
            );
        });

        it("should emit ContributionReceived event", async function () {
            await expect(
                tournament.connect(contributor).contribute({value: ethers.parseEther("2")})
            )
                .to.emit(tournament, "ContributionReceived")
                .withArgs(contributor.address, ethers.parseEther("2"));
        });
    });

    describe("distributePrizes", function () {
        it("should distribute prizes for WinnerTakesAll", async function () {
            await time.increase(START_DATE_OFFSET + 1);
            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});
            await tournament.connect(contributor).contribute({value: TOTAL_PRIZE_POOL});

            await time.increase(END_DATE_OFFSET + 1); // Move past end date
            const winners = [player1.address];
            const amounts = [TOTAL_PRIZE_POOL];

            await expect(tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.emit(tournament, "PrizesDistributed")
                .withArgs(winners, amounts);
        });

        it("should revert if not called by organizer", async function () {
            await time.increase(END_DATE_OFFSET + 1);
            await expect(
                tournament.connect(player1).distributePrizes([player1.address], [TOTAL_PRIZE_POOL])
            ).to.be.revertedWith("Only organizer can distribute prizes");
        });
    });

    describe("cancelTournament", function () {
        it("should refund players and contributors", async function () {
            await time.increase(START_DATE_OFFSET + 1);
            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});
            await tournament.connect(contributor).contribute({value: ethers.parseEther("2")});

            const player1BalanceBefore = await ethers.provider.getBalance(player1.address);
            await tournament.connect(organizer).cancelTournament();

            expect(await tournament.status()).to.equal(2); // Canceled
            expect(await ethers.provider.getBalance(player1.address)).to.be.above(
                player1BalanceBefore
            );
        });
    });

    describe("withdrawRemainingFunds", function () {
        it("should allow organizer to withdraw remaining funds after distribution", async function () {
            await time.increase(START_DATE_OFFSET + 1);
            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});
            await tournament.connect(contributor).contribute({value: TOTAL_PRIZE_POOL});

            await time.increase(END_DATE_OFFSET + 1);
            await tournament.connect(organizer).distributePrizes([player1.address], [TOTAL_PRIZE_POOL]);

            const organizerBalanceBefore = await ethers.provider.getBalance(organizer.address);
            await tournament.connect(organizer).withdrawRemainingFunds();
            expect(await ethers.provider.getBalance(organizer.address)).to.be.above(
                organizerBalanceBefore
            );
        });
    });
});