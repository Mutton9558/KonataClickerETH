// contracts/Counter.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ScoreData {
    mapping(address => uint256) public scoreData;

    event ScoreSaved(address indexed user, uint256 score);

    function setData(uint256 data) public {
        scoreData[msg.sender] = data;
    }

    function getData(address user) public view returns (uint256) {
        return scoreData[user];
    }
}
