// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TournamentPayment {
    struct Payment {
        uint256 amount;
        bool paid;
    }

    mapping(address => mapping(uint256 => Payment)) public payments;
    address public owner;

    event PaymentReceived(
        address indexed payer,
        uint256 indexed tournamentId,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
    }

    function payEntryFee(uint256 tournamentId) external payable {
        require(msg.value > 0, "Payment amount must be greater than 0");

        payments[msg.sender][tournamentId] = Payment({
            amount: msg.value,
            paid: true
        });

        emit PaymentReceived(msg.sender, tournamentId, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    function hasPaid(address participant, uint256 tournamentId) external view returns (bool) {
        return payments[participant][tournamentId].paid;
    }
}