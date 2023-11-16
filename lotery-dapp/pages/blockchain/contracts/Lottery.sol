// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Lottery{
    address public owner;
    address payable[] public players;

    constructor() {
        owner = msg.sender;

    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > 0.00001 ether);

        // address of player entering lottery
        players.push(payable(msg.sender));

    }

    function getRandomNumber() public view returns (uint) {
        return uint(keccak256(abi.encodePacked(owner, block.timestamp)));
    }

    function pickWinner() public {
        uint index = getRandomNumber() % players.length;
        players[index].transfer(address(this).balance);

        // reset the state of the contract
        players = new address payable[](0); 
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

}