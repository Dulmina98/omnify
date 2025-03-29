import {loadFixture, time,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import hre from "hardhat";

describe("Tournament", function () {
    // We define a fixture to reuse the same setup in every test
    async function deployTournamentFixture() {
        const ONE_ETHER = hre.ethers.parseEther("1.0");
        const ENTRY_FEE = hre.ethers.parseEther("0.1");
        const NUM_PLAYERS = 8;

        // Get current timestamp and convert to BigInt
        const currentTime = BigInt(await time.latest());

        // Tournament starts now and ends in 7 days
        const START_DATE = currentTime;
        const END_DATE = currentTime + BigInt(7 * 24 * 60 * 60); // 7 days

        const PRIZE_POOL = hre.ethers.parseEther("1.0");
        // 0 for WinnerTakesAll, 1 for Top3
        const PRIZE_DISTRIBUTION = 0;

        // Get signers
        const [organizer, player1, player2, player3, player4, player5, player6, player7, player8, contributor] =
            await hre.ethers.getSigners();

        // Deploy tournament contract
        const Tournament = await hre.ethers.getContractFactory("Tournament");
        const tournament = await Tournament.connect(organizer).deploy(
            ENTRY_FEE,
            NUM_PLAYERS,
            START_DATE,
            END_DATE,
            PRIZE_POOL,
            PRIZE_DISTRIBUTION
        );

        return {
            tournament,
            ENTRY_FEE,
            NUM_PLAYERS,
            START_DATE,
            END_DATE,
            PRIZE_POOL,
            PRIZE_DISTRIBUTION,
            organizer,
            player1,
            player2,
            player3,
            player4,
            player5,
            player6,
            player7,
            player8,
            contributor
        };
    }

    describe("Deployment", function () {
        it("Should set the right organizer", async function () {
            const {tournament, organizer} = await loadFixture(deployTournamentFixture);
            expect(await tournament.organizer()).to.equal(organizer.address);
        });

        it("Should set the right entry fee", async function () {
            const {tournament, ENTRY_FEE} = await loadFixture(deployTournamentFixture);
            expect(await tournament.entryFee()).to.equal(ENTRY_FEE);
        });

        it("Should set the right number of players required", async function () {
            const {tournament, NUM_PLAYERS} = await loadFixture(deployTournamentFixture);
            expect(await tournament.numberOfPlayersRequired()).to.equal(NUM_PLAYERS);
        });

        it("Should set the right start date", async function () {
            const {tournament, START_DATE} = await loadFixture(deployTournamentFixture);
            expect(await tournament.startDate()).to.equal(START_DATE);
        });

        it("Should set the right end date", async function () {
            const {tournament, END_DATE} = await loadFixture(deployTournamentFixture);
            expect(await tournament.endDate()).to.equal(END_DATE);
        });

        it("Should set the right prize pool", async function () {
            const {tournament, PRIZE_POOL} = await loadFixture(deployTournamentFixture);
            expect(await tournament.totalPrizePool()).to.equal(PRIZE_POOL);
        });

        it("Should set the right prize distribution method", async function () {
            const {tournament, PRIZE_DISTRIBUTION} = await loadFixture(deployTournamentFixture);
            expect(await tournament.prizeDistributionMethod()).to.equal(PRIZE_DISTRIBUTION);
        });

        it("Should initialize with Ongoing status", async function () {
            const {tournament} = await loadFixture(deployTournamentFixture);
            expect(await tournament.status()).to.equal(0); // 0 is Ongoing
        });
    });

    describe("Entry Fee Payment", function () {
        it("Should allow players to pay entry fee", async function () {
            const {tournament, ENTRY_FEE, player1} = await loadFixture(deployTournamentFixture);

            await expect(tournament.connect(player1).payEntryFee({value: ENTRY_FEE}))
                .to.emit(tournament, "PlayerPaid")
                .withArgs(player1.address, ENTRY_FEE);

            expect(await tournament.paidPlayers(player1.address)).to.be.true;
        });

        it("Should fail if incorrect entry fee amount", async function () {
            const {tournament, ENTRY_FEE, player1} = await loadFixture(deployTournamentFixture);
            const incorrectFee = ENTRY_FEE / 2n;

            await expect(tournament.connect(player1).payEntryFee({value: incorrectFee}))
                .to.be.revertedWith("Incorrect entry fee amount");
        });

        it("Should fail if player already paid", async function () {
            const {tournament, ENTRY_FEE, player1} = await loadFixture(deployTournamentFixture);

            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});

            await expect(tournament.connect(player1).payEntryFee({value: ENTRY_FEE}))
                .to.be.revertedWith("Already paid");
        });

        it("Should fail if tournament has ended", async function () {
            const {tournament, ENTRY_FEE, END_DATE, player1} = await loadFixture(deployTournamentFixture);

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            await expect(tournament.connect(player1).payEntryFee({value: ENTRY_FEE}))
                .to.be.revertedWith("Tournament has ended");
        });

        it("Should fail if tournament is full", async function () {
            const {tournament, ENTRY_FEE, player1, player2, player3} = await loadFixture(deployTournamentFixture);

            // Deploy with only 2 players required for testing
            const NUM_PLAYERS = 2;
            const currentTime = BigInt(await time.latest());
            const START_DATE = currentTime;
            const END_DATE = currentTime + BigInt(7 * 24 * 60 * 60);
            const PRIZE_POOL = hre.ethers.parseEther("1.0");
            const PRIZE_DISTRIBUTION = 0;

            const [organizer, p1, p2, p3] = await hre.ethers.getSigners();

            const Tournament = await hre.ethers.getContractFactory("Tournament");
            const smallTournament = await Tournament.connect(organizer).deploy(
                ENTRY_FEE,
                NUM_PLAYERS,
                START_DATE,
                END_DATE,
                PRIZE_POOL,
                PRIZE_DISTRIBUTION
            );

            await smallTournament.connect(p1).payEntryFee({value: ENTRY_FEE});
            await smallTournament.connect(p2).payEntryFee({value: ENTRY_FEE});

            await expect(smallTournament.connect(p3).payEntryFee({value: ENTRY_FEE}))
                .to.be.revertedWith("Tournament full");
        });
    });

    describe("Contributions", function () {
        it("Should allow contributions to prize pool", async function () {
            const {tournament, contributor} = await loadFixture(deployTournamentFixture);
            const contribution = hre.ethers.parseEther("0.5");

            await expect(tournament.connect(contributor).contribute({value: contribution}))
                .to.emit(tournament, "ContributionReceived")
                .withArgs(contributor.address, contribution);

            expect(await tournament.contributions(contributor.address)).to.equal(contribution);
        });

        it("Should track multiple contributions from same address", async function () {
            const {tournament, contributor} = await loadFixture(deployTournamentFixture);
            const contribution1 = hre.ethers.parseEther("0.5");
            const contribution2 = hre.ethers.parseEther("0.3");
            const totalContribution = contribution1 + contribution2;

            await tournament.connect(contributor).contribute({value: contribution1});
            await tournament.connect(contributor).contribute({value: contribution2});

            expect(await tournament.contributions(contributor.address)).to.equal(totalContribution);
        });

        it("Should fail if contribution amount is zero", async function () {
            const {tournament, contributor} = await loadFixture(deployTournamentFixture);

            await expect(tournament.connect(contributor).contribute({value: 0}))
                .to.be.revertedWith("Contribution must be greater than 0");
        });

        it("Should fail if tournament is not ongoing", async function () {
            const {tournament, organizer, contributor} = await loadFixture(deployTournamentFixture);
            const contribution = hre.ethers.parseEther("0.5");

            // Cancel the tournament
            await tournament.connect(organizer).cancelTournament();

            await expect(tournament.connect(contributor).contribute({value: contribution}))
                .to.be.revertedWith("Tournament not ongoing");
        });
    });

    describe("Match Results", function () {
        it("Should allow players to submit match results", async function () {
            const {tournament, player1, player2} = await loadFixture(deployTournamentFixture);
            const matchId = 1;

            await expect(tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address))
                .to.emit(tournament, "MatchResultSubmitted")
                .withArgs(matchId, player1.address, player2.address, player1.address);
        });

        it("Should update match results when both players agree", async function () {
            const {tournament, player1, player2} = await loadFixture(deployTournamentFixture);
            const matchId = 1;

            await tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player1.address);

            const matchResult = await tournament.matchResults(matchId);
            expect(matchResult.winner).to.equal(player1.address);
            expect(matchResult.disputed).to.equal(false);
        });

        it("Should mark match as disputed when players disagree", async function () {
            const {tournament, player1, player2} = await loadFixture(deployTournamentFixture);
            const matchId = 1;

            await tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player2.address);

            const matchResult = await tournament.matchResults(matchId);
            expect(matchResult.disputed).to.equal(true);
        });

        it("Should allow organizer to resolve disputes", async function () {
            const {tournament, organizer, player1, player2} = await loadFixture(deployTournamentFixture);
            const matchId = 1;

            await tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player2.address);

            await expect(tournament.connect(organizer).resolveDispute(matchId, player1.address))
                .to.emit(tournament, "DisputeResolved")
                .withArgs(matchId, player1.address, player2.address, player1.address);

            const matchResult = await tournament.matchResults(matchId);
            expect(matchResult.winner).to.equal(player1.address);
            expect(matchResult.disputed).to.equal(false);
        });

        it("Should fail if non-participant tries to submit match result", async function () {
            const {tournament, player1, player2, player3} = await loadFixture(deployTournamentFixture);
            const matchId = 1;

            await expect(tournament.connect(player3).submitMatchResult(matchId, player1.address, player2.address, player1.address))
                .to.be.revertedWith("Only match players can submit");
        });

        it("Should fail if non-organizer tries to resolve dispute", async function () {
            const {tournament, player1, player2, player3} = await loadFixture(deployTournamentFixture);
            const matchId = 1;

            await tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player2.address);

            await expect(tournament.connect(player3).resolveDispute(matchId, player1.address))
                .to.be.revertedWith("Only organizer can resolve disputes");
        });
    });

    describe("Prize Distribution", function () {
        it("Should allow organizer to distribute prizes (WinnerTakesAll)", async function () {
            const {
                tournament,
                organizer,
                player1,
                END_DATE,
                PRIZE_POOL
            } = await loadFixture(deployTournamentFixture);

            // Fund the contract with the prize pool amount
            await tournament.connect(organizer).contribute({value: PRIZE_POOL});

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            const winners = [player1.address];
            const amounts = [PRIZE_POOL];

            await expect(tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.emit(tournament, "PrizesDistributed")
                .withArgs(winners, amounts);

            expect(await tournament.status()).to.equal(1); // 1 is Distributed
        });

        it("Should allow organizer to distribute prizes (Top3)", async function () {
            const ENTRY_FEE = hre.ethers.parseEther("0.1");
            const NUM_PLAYERS = 8;
            const currentTime = BigInt(await time.latest());
            const START_DATE = currentTime;
            const END_DATE = currentTime + BigInt(7 * 24 * 60 * 60);
            const PRIZE_POOL = hre.ethers.parseEther("1.0");
            const PRIZE_DISTRIBUTION = 1; // Top3

            const [organizer, player1, player2, player3] = await hre.ethers.getSigners();

            const Tournament = await hre.ethers.getContractFactory("Tournament");
            const top3Tournament = await Tournament.connect(organizer).deploy(
                ENTRY_FEE,
                NUM_PLAYERS,
                START_DATE,
                END_DATE,
                PRIZE_POOL,
                PRIZE_DISTRIBUTION
            );

            // Fund the contract with the prize pool amount
            await top3Tournament.connect(organizer).contribute({value: PRIZE_POOL});

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            const winners = [player1.address, player2.address, player3.address];
            const firstPrize = hre.ethers.parseEther("0.6");
            const secondPrize = hre.ethers.parseEther("0.3");
            const thirdPrize = hre.ethers.parseEther("0.1");
            const amounts = [firstPrize, secondPrize, thirdPrize];

            await expect(top3Tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.emit(top3Tournament, "PrizesDistributed")
                .withArgs(winners, amounts);

            expect(await top3Tournament.status()).to.equal(1); // 1 is Distributed
        });

        it("Should fail if tournament hasn't ended yet", async function () {
            const {tournament, organizer, player1, PRIZE_POOL} = await loadFixture(deployTournamentFixture);

            const winners = [player1.address];
            const amounts = [PRIZE_POOL];

            await expect(tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.be.revertedWith("Tournament has not yet ended");
        });

        it("Should fail if non-organizer tries to distribute prizes", async function () {
            const {tournament, player1, END_DATE, PRIZE_POOL} = await loadFixture(deployTournamentFixture);

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            const winners = [player1.address];
            const amounts = [PRIZE_POOL];

            await expect(tournament.connect(player1).distributePrizes(winners, amounts))
                .to.be.revertedWith("Only organizer can distribute prizes");
        });

        it("Should fail with incorrect prize distribution (WinnerTakesAll)", async function () {
            const {
                tournament,
                organizer,
                player1,
                player2,
                END_DATE,
                PRIZE_POOL
            } = await loadFixture(deployTournamentFixture);

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            const winners = [player1.address, player2.address];
            const amounts = [PRIZE_POOL / 2n, PRIZE_POOL / 2n];

            await expect(tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.be.revertedWith("WinnerTakesAll requires exactly 1 winner");
        });

        it("Should fail with incorrect prize distribution (Top3)", async function () {
            // Deploy a tournament with Top3 prize distribution
            const ENTRY_FEE = hre.ethers.parseEther("0.1");
            const NUM_PLAYERS = 8;
            const currentTime = BigInt(await time.latest());
            const START_DATE = currentTime;
            const END_DATE = currentTime + BigInt(7 * 24 * 60 * 60);
            const PRIZE_POOL = hre.ethers.parseEther("1.0");
            const PRIZE_DISTRIBUTION = 1; // Top3

            const [organizer, player1, player2] = await hre.ethers.getSigners();

            const Tournament = await hre.ethers.getContractFactory("Tournament");
            const top3Tournament = await Tournament.connect(organizer).deploy(
                ENTRY_FEE,
                NUM_PLAYERS,
                START_DATE,
                END_DATE,
                PRIZE_POOL,
                PRIZE_DISTRIBUTION
            );

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            // Only 2 winners instead of 3
            const winners = [player1.address, player2.address];
            const amounts = [PRIZE_POOL / 2n, PRIZE_POOL / 2n];

            await expect(top3Tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.be.revertedWith("Top3 requires exactly 3 winners");
        });

        it("Should fail if total amount doesn't match prize pool", async function () {
            const {tournament, organizer, player1, END_DATE, PRIZE_POOL} = await loadFixture(deployTournamentFixture);

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            const winners = [player1.address];
            const amounts = [PRIZE_POOL - 1n]; // 1 wei less than prize pool

            await expect(tournament.connect(organizer).distributePrizes(winners, amounts))
                .to.be.revertedWith("Total amount must equal prize pool");
        });
    });

    describe("Tournament Cancellation", function () {
        it("Should allow organizer to cancel tournament", async function () {
            const {tournament, organizer} = await loadFixture(deployTournamentFixture);

            await expect(tournament.connect(organizer).cancelTournament())
                .to.emit(tournament, "TournamentCanceled");

            expect(await tournament.status()).to.equal(2); // 2 is Canceled
        });

        it("Should refund entry fees when tournament is canceled", async function () {
            const {tournament, organizer, player1, ENTRY_FEE} = await loadFixture(deployTournamentFixture);

            // Player1 pays entry fee
            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});

            // Check balance change when tournament is canceled
            await expect(tournament.connect(organizer).cancelTournament())
                .to.changeEtherBalances(
                    [player1, tournament],
                    [ENTRY_FEE, -ENTRY_FEE]
                );
        });

        it("Should refund contributions when tournament is canceled", async function () {
            const {tournament, organizer, contributor} = await loadFixture(deployTournamentFixture);
            const contribution = hre.ethers.parseEther("0.5");

            // Contributor makes contribution
            await tournament.connect(contributor).contribute({value: contribution});

            // Check balance change when tournament is canceled
            await expect(tournament.connect(organizer).cancelTournament())
                .to.changeEtherBalances(
                    [contributor, tournament],
                    [contribution, -contribution]
                );
        });

        it("Should fail if non-organizer tries to cancel tournament", async function () {
            const {tournament, player1} = await loadFixture(deployTournamentFixture);

            await expect(tournament.connect(player1).cancelTournament())
                .to.be.revertedWith("Only organizer can cancel");
        });

        it("Should fail if tournament already distributed prizes", async function () {
            const {tournament, organizer, player1, END_DATE, PRIZE_POOL} = await loadFixture(deployTournamentFixture);

            // Fund the contract with the prize pool amount
            await tournament.connect(organizer).contribute({value: PRIZE_POOL});

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            // Distribute prizes
            const winners = [player1.address];
            const amounts = [PRIZE_POOL];
            await tournament.connect(organizer).distributePrizes(winners, amounts);

            // Try to cancel
            await expect(tournament.connect(organizer).cancelTournament())
                .to.be.revertedWith("Tournament not ongoing");
        });
    });

    describe("Prize Claiming", function () {
        it("Should allow winner to claim prize directly", async function () {
            const {
                tournament,
                player1,
                player2,
                organizer,
                ENTRY_FEE,
                PRIZE_POOL
            } = await loadFixture(deployTournamentFixture);

            // Set up a match with player1 as winner (matchId 3 is the grand final per contract)
            const matchId = 3;
            await tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player1.address);

            // Fund the contract: player1 pays entry fee, organizer contributes the rest
            await tournament.connect(player1).payEntryFee({value: ENTRY_FEE});
            const remainingFunds = PRIZE_POOL - ENTRY_FEE;
            await tournament.connect(organizer).contribute({value: remainingFunds});

            // Winner claims prize
            await expect(tournament.connect(player1).claimPrize())
                .to.emit(tournament, "PrizeClaimed")
                .withArgs(player1.address, PRIZE_POOL);

            expect(await tournament.status()).to.equal(1); // 1 is Distributed
        });

        it("Should fail if claimer is not the final match winner", async function () {
            const {tournament, player1, player2, player3} = await loadFixture(deployTournamentFixture);

            // Set up a match with player1 as winner
            const matchId = 3;
            await tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player1.address);

            // Player3 tries to claim
            await expect(tournament.connect(player3).claimPrize())
                .to.be.revertedWith("Only the grand final winner can claim");
        });

        it("Should fail if using Top3 distribution method", async function () {
            // Deploy a tournament with Top3 prize distribution
            const ENTRY_FEE = hre.ethers.parseEther("0.1");
            const NUM_PLAYERS = 8;
            const currentTime = BigInt(await time.latest());
            const START_DATE = currentTime;
            const END_DATE = currentTime + BigInt(7 * 24 * 60 * 60);
            const PRIZE_POOL = hre.ethers.parseEther("1.0");
            const PRIZE_DISTRIBUTION = 1; // Top3

            const [organizer, player1, player2] = await hre.ethers.getSigners();

            const Tournament = await hre.ethers.getContractFactory("Tournament");
            const top3Tournament = await Tournament.connect(organizer).deploy(
                ENTRY_FEE,
                NUM_PLAYERS,
                START_DATE,
                END_DATE,
                PRIZE_POOL,
                PRIZE_DISTRIBUTION
            );

            // Set up a match with player1 as winner
            const matchId = 3;
            await top3Tournament.connect(player1).submitMatchResult(matchId, player1.address, player2.address, player1.address);
            await top3Tournament.connect(player2).submitMatchResult(matchId, player1.address, player2.address, player1.address);

            await expect(top3Tournament.connect(player1).claimPrize())
                .to.be.revertedWith("Only WinnerTakesAll supported");
        });
    });

    describe("Remaining Funds Withdrawal", function () {
        it("Should allow organizer to withdraw remaining funds after distribution", async function () {
            const {tournament, organizer, player1, END_DATE, PRIZE_POOL} = await loadFixture(deployTournamentFixture);

            const extraFunds = hre.ethers.parseEther("0.5");

            // Fund the contract with prize pool plus extra funds
            await tournament.connect(organizer).contribute({value: PRIZE_POOL + extraFunds});

            // Move time forward past the end date
            await time.increaseTo(END_DATE + 1n);

            // Distribute prizes
            const winners = [player1.address];
            const amounts = [PRIZE_POOL];
            await tournament.connect(organizer).distributePrizes(winners, amounts);

            // Organizer withdraws remaining funds
            await expect(tournament.connect(organizer).withdrawRemainingFunds())
                .to.changeEtherBalance(organizer, extraFunds);
        });

        it("Should fail if tournament is still ongoing", async function () {
            const {tournament, organizer} = await loadFixture(deployTournamentFixture);

            await expect(tournament.connect(organizer).withdrawRemainingFunds())
                .to.be.revertedWith("Tournament still ongoing");
        });

        it("Should fail if non-organizer tries to withdraw", async function () {
            const {tournament, player1, organizer, END_DATE} = await loadFixture(deployTournamentFixture);

            // Cancel tournament to change status
            await tournament.connect(organizer).cancelTournament();

            await expect(tournament.connect(player1).withdrawRemainingFunds())
                .to.be.revertedWith("Only organizer can withdraw");
        });

        it("Should fail if no funds to withdraw", async function () {
            const {tournament, organizer} = await loadFixture(deployTournamentFixture);

            // Cancel tournament (no funds in it)
            await tournament.connect(organizer).cancelTournament();

            await expect(tournament.connect(organizer).withdrawRemainingFunds())
                .to.be.revertedWith("No funds to withdraw");
        });
    });
});