// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Tournament {
    // State variables
    address public organizer;           // The deployer is the organizer
    uint public entryFee;               // Entry fee in wei (set at deployment)
    mapping(address => bool) public paidPlayers; // Tracks who has paid
    address[] public players;           // List of player addresses
    enum TournamentStatus {Ongoing, Distributed, Canceled}
    TournamentStatus public status;     // Tournament state

    // Events for transparency
    event PlayerPaid(address indexed player, uint amount);
    event ContributionReceived(address indexed contributor, uint amount);
    event PrizesDistributed(address[] winners, uint[] amounts);
    event TournamentCanceled();

    // Constructor: Set organizer and entry fee
    constructor(uint _entryFee) {
        organizer = msg.sender;
        entryFee = _entryFee;
        status = TournamentStatus.Ongoing;
    }

    // Step 2: Players pay entry fee to join
    function payEntryFee() external payable {
        require(status == TournamentStatus.Ongoing, "Tournament not ongoing");
        require(msg.value == entryFee, "Incorrect entry fee amount");
        require(!paidPlayers[msg.sender], "Already paid");
        paidPlayers[msg.sender] = true;
        players.push(msg.sender);
        emit PlayerPaid(msg.sender, msg.value);
    }

    // Step 3: Accept contributions to prize pool
    function contribute() external payable {
        require(status == TournamentStatus.Ongoing, "Tournament not ongoing");
        require(msg.value > 0, "Contribution must be greater than 0");
        emit ContributionReceived(msg.sender, msg.value);
    }

    // Step 4: Get the current prize pool (contract balance)
    function getPrizePool() external view returns (uint) {
        return address(this).balance;
    }

    // Step 5: Distribute prizes to winners
    function distributePrizes(address[] calldata winners, uint[] calldata amounts) external {
        require(msg.sender == organizer, "Only organizer can distribute prizes");
        require(status == TournamentStatus.Ongoing, "Prizes already distributed or canceled");
        require(winners.length == amounts.length, "Winners and amounts length mismatch");

        uint totalAmount = 0;
        for (uint i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalAmount <= address(this).balance, "Not enough funds in prize pool");

        // Distribute prizes
        for (uint i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(amounts[i]);
        }
        status = TournamentStatus.Distributed;
        emit PrizesDistributed(winners, amounts);
    }

    // Step 7: Cancel tournament and refund players
    function cancelTournament() external {
        require(msg.sender == organizer, "Only organizer can cancel");
        require(status == TournamentStatus.Ongoing, "Tournament not ongoing");

        status = TournamentStatus.Canceled;
        for (uint i = 0; i < players.length; i++) {
            payable(players[i]).transfer(entryFee);
        }
        emit TournamentCanceled();
    }

    // Step 7: Organizer withdraws remaining funds (after distribution or cancellation)
    function withdrawRemainingFunds() external {
        require(msg.sender == organizer, "Only organizer can withdraw");
        require(status != TournamentStatus.Ongoing, "Tournament still ongoing");
        uint remainingBalance = address(this).balance;
        require(remainingBalance > 0, "No funds to withdraw");
        payable(organizer).transfer(remainingBalance);
    }
}