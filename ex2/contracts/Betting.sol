pragma solidity ^0.4.15;

contract Betting {
	/* Standard state variables */
	address public owner;
	address public gamblerA;
	address public gamblerB;
	address public oracle;
	uint[] outcomes;	// Feel free to replace with a mapping

	/* Structs are custom data structures with self-defined parameters */
	struct Bet {
		uint outcome;
		uint amount;
		bool initialized;
	}

	/* Keep track of every gambler's bet */
	mapping (address => Bet) bets;
	/* Keep track of every player's winnings (if any) */
	mapping (address => uint) winnings;

	/* Add any events you think are necessary */
	event BetMade(address gambler);
	event BetClosed();

	/* Uh Oh, what are these? */
	modifier OwnerOnly() {if (msg.sender == owner) {_;}}
	modifier OracleOnly() {if (msg.sender == oracle) {_;}}
	modifier sufficientFunds(uint amount) {if (amount <= winnings[msg.sender]) {_;}}

	/* Constructor function, where owner and outcomes are set */
	function Betting(uint[] _outcomes) {
		owner = msg.sender;
		outcomes = _outcomes;
	}

	/* Owner chooses their trusted Oracle */
	function chooseOracle(address _oracle) OwnerOnly() returns (address) {
		if (gamblerA != _oracle && gamblerB != _oracle) {
			oracle = _oracle;
		}
		return oracle;
	}

	/* Gamblers place their bets, preferably after calling checkOutcomes */
	function makeBet(uint _outcome) payable returns (bool) {
		if (msg.sender == owner || msg.sender == oracle || bets[msg.sender].initialized) {
			return false;
		}
		uint i = 0;
		for (i = 0; i < outcomes.length; i++) {
			if (outcomes[i] == _outcome) {
				break;
			}
		}
		if (i == outcomes.length) {
			return false;
		}
		if (!bets[gamblerA].initialized) {
			gamblerA = msg.sender;
		} else if (!bets[gamblerB].initialized) {
			gamblerB = msg.sender;
		} else {
			return false;
		}
		bets[msg.sender] = Bet(_outcome, msg.value, true);
		BetMade(msg.sender);
		if (bets[gamblerA].initialized && bets[gamblerB].initialized) {
			BetClosed();
		}
		return true;
	}

	/* The oracle chooses which outcome wins */
	function makeDecision(uint _outcome) OracleOnly() {
		Bet storage betA = bets[gamblerA];
		Bet storage betB = bets[gamblerB];
		uint totalBet = betA.amount + betB.amount;
		if (!betA.initialized || !betB.initialized) {
			return;
		} else if (betA.outcome == betB.outcome) {
			contractReset();
		} else if (betA.outcome == _outcome) {
			winnings[gamblerA] = totalBet;
		} else if (betB.outcome == _outcome) {
			winnings[gamblerB] = totalBet;
		} else {
			winnings[oracle] = totalBet;
		}
		contractReset();
	}

	/* Allow anyone to withdraw their winnings safely (if they have enough) */
	function withdraw(uint withdrawAmount)
	sufficientFunds(withdrawAmount) returns (uint remainingBal)
	{
		winnings[msg.sender] -= withdrawAmount;
		msg.sender.transfer(withdrawAmount);
		return winnings[msg.sender];
	}
	
	/* Allow anyone to check the outcomes they can bet on */
	function checkOutcomes() public constant returns (uint[]) {
		return outcomes;
	}
	
	/* Allow anyone to check if they won any bets */
	function checkWinnings() public constant returns(uint) {
		return winnings[msg.sender];
	}

	/* Call delete() to reset certain state variables. Which ones? That's upto you to decide */
	function contractReset() private {
		delete(bets[gamblerA]);
		delete(bets[gamblerB]);
		delete(gamblerA);
		delete(gamblerB);
		delete(oracle);
	}

	/* Fallback function */
	function() payable {
		revert();
	}
}
