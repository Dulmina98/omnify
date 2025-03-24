// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Tournament {
    address public organizer;
    uint256 public entryFee;
    uint256 public numberOfPlayersRequired;
    uint256 public startDate;
    uint256 public endDate;
    uint256 public totalPrizePool;
    enum PrizeDistributionMethod {WinnerTakesAll, Top3}
    PrizeDistributionMethod public prizeDistributionMethod;
    mapping(address => bool) public paidPlayers;
    address[] public players;
    mapping(address => uint256) public contributions;
    address[] public contributors;
    enum TournamentStatus {Ongoing, Distributed, Canceled}
    TournamentStatus public status;

    // New struct for match results
    struct MatchResult {
        uint256 matchId;
        address player1;
        address player2;
        address winner;
        bool submitted;
        bool disputed;
    }
    // Mapping to store match results
    mapping(uint256 => MatchResult) public matchResults;

    event PlayerPaid(address indexed player, uint256 amount);
    event ContributionReceived(address indexed contributor, uint256 amount);
    event PrizesDistributed(address[] winners, uint256[] amounts);
    event TournamentCanceled();
    event MatchResultSubmitted(uint256 matchId, address player1, address player2, address winner);
    event MatchResultDisputed(uint256 matchId);

    constructor(
        uint256 _entryFee,
        uint256 _numberOfPlayersRequired,
        uint256 _startDate,
        uint256 _endDate,
        uint256 _totalPrizePool,
        PrizeDistributionMethod _prizeDistributionMethod
    ) {
        organizer = msg.sender;
        entryFee = _entryFee;
        numberOfPlayersRequired = _numberOfPlayersRequired;
        startDate = _startDate;
        endDate = _endDate;
        totalPrizePool = _totalPrizePool;
        prizeDistributionMethod = _prizeDistributionMethod;
        status = TournamentStatus.Ongoing;
    }

    function payEntryFee() external payable {
        require(block.timestamp >= startDate, "Tournament not yet started");
        require(block.timestamp <= endDate, "Tournament has ended");
        require(status == TournamentStatus.Ongoing, "Tournament not ongoing");
        require(msg.value == entryFee, "Incorrect entry fee amount");
        require(!paidPlayers[msg.sender], "Already paid");
        require(players.length < numberOfPlayersRequired, "Tournament full");
        paidPlayers[msg.sender] = true;
        players.push(msg.sender);
        emit PlayerPaid(msg.sender, msg.value);
    }

    function contribute() external payable {
        require(status == TournamentStatus.Ongoing, "Tournament not ongoing");
        require(msg.value > 0, "Contribution must be greater than 0");
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        emit ContributionReceived(msg.sender, msg.value);
    }

    function getPrizePool() external view returns (uint256) {
        return totalPrizePool;
    }

    function distributePrizes(address[] calldata winners, uint256[] calldata amounts) external {
        require(msg.sender == organizer, "Only organizer can distribute prizes");
        require(status == TournamentStatus.Ongoing, "Prizes already distributed or canceled");
        require(block.timestamp > endDate, "Tournament has not yet ended");
        require(winners.length == amounts.length, "Winners and amounts length mismatch");

        if (prizeDistributionMethod == PrizeDistributionMethod.WinnerTakesAll) {
            require(winners.length == 1, "WinnerTakesAll requires exactly 1 winner");
        } else if (prizeDistributionMethod == PrizeDistributionMethod.Top3) {
            require(winners.length == 3, "Top3 requires exactly 3 winners");
            require(amounts[0] > amounts[1] && amounts[1] > amounts[2], "Top3 must have descending amounts");
        }

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalAmount == totalPrizePool, "Total amount must equal prize pool");
        require(totalAmount <= address(this).balance, "Not enough funds in prize pool");

        for (uint256 i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(amounts[i]);
        }
        status = TournamentStatus.Distributed;
        emit PrizesDistributed(winners, amounts);
    }

    function cancelTournament() external {
        require(msg.sender == organizer, "Only organizer can cancel");
        require(status == TournamentStatus.Ongoing, "Tournament not ongoing");

        status = TournamentStatus.Canceled;
        for (uint256 i = 0; i < players.length; i++) {
            payable(players[i]).transfer(entryFee);
        }
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 amount = contributions[contributor];
            if (amount > 0) {
                payable(contributor).transfer(amount);
                contributions[contributor] = 0;
            }
        }
        emit TournamentCanceled();
    }

    function withdrawRemainingFunds() external {
        require(msg.sender == organizer, "Only organizer can withdraw");
        require(status != TournamentStatus.Ongoing, "Tournament still ongoing");
        uint256 remainingBalance = address(this).balance;
        require(remainingBalance > 0, "No funds to withdraw");
        payable(organizer).transfer(remainingBalance);
    }

    function submitMatchResult(
        uint256 matchId,
        address player1,
        address player2,
        address winner
    ) external {
        require(msg.sender == organizer || paidPlayers[msg.sender], "Only organizer or players can submit");
        require(status == TournamentStatus.Ongoing, "Tournament must be ongoing");
        require(player1 != address(0) && player2 != address(0), "Invalid player addresses");
        require(winner == player1 || winner == player2, "Winner must be one of the players");
        require(!matchResults[matchId].submitted, "Match result already submitted");

        matchResults[matchId] = MatchResult(matchId, player1, player2, winner, true, false);
        emit MatchResultSubmitted(matchId, player1, player2, winner);
    }

    function disputeMatchResult(uint256 matchId) external {
        require(paidPlayers[msg.sender], "Only players can dispute");
        require(matchResults[matchId].submitted, "Match result not submitted yet");
        require(!matchResults[matchId].disputed, "Match already disputed");

        matchResults[matchId].disputed = true;
        emit MatchResultDisputed(matchId);
    }
}