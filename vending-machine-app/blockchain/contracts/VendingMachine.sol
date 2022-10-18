// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract VendingMachine {

    // state variables
    address public owner;
    mapping (address => uint) public donutBalances;

// modifier to check if caller is owner
    modifier onlyOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    // set the owner as th address that deployed the contract
    // set the initial vending machine balance to 100
    constructor() {
        owner = msg.sender;
        donutBalances[address(this)] = 100;
    }

    function getVendingMachineStock() public view returns (uint) {
        return donutBalances[address(this)];
    }

    function getVendingMachineValance() public onlyOwner  view returns (uint) {
        return address(this).balance;
    }

    // Let the owner restock the vending machine
    function restock(uint amount) public {
        require(msg.sender == owner, "Only the owner can restock.");
        donutBalances[address(this)] += amount;
    }

    // Purchase donuts from the vending machine
    function purchase(uint amount) public payable {
        require(msg.value >= amount * 0.1 ether, "You must pay at least 0.1 ETH per donut");
        require(donutBalances[address(this)] >= amount, "Not enough donuts in stock to complete this purchase");
        donutBalances[address(this)] -= amount;
        donutBalances[msg.sender] += amount;
    }

    event NewWithdrawl(uint256 amount);
    // Only owner can retrieve funds
    function withdrawAll() public onlyOwner {
		uint256 amount = address(this).balance; // get the amount of ether in the contract
		require(amount > 0, 'You have no ether to withdraw');
		(bool success, ) = owner.call{value: amount}('');
		require(success, 'Withdraw failed');
		emit NewWithdrawl(amount);
	}
    
    
}