var Betting = artifacts.require("./Betting.sol");

contract('BettingTestGeneric', function(accounts) {
	const args = {_default: accounts[0], _owner: accounts[1]};

	it("The contract can be deployed", function() {
		return Betting.new()
		.then(function(instance) {
			assert.ok(instance.address);
		});
	});

	it("The contract can be deployed by custom addresses (default)", function() {
		return Betting.new()
		.then(function(instance) {
			return instance.owner.call();
		})
		.then(function(result) {
			assert.equal(result, args._default, "contract owned by " +
				"the wrong address");
		});
	});

	it("The contract can be deployed by custom addresses (using 'from')", function() {
		return Betting.new({from: args._owner})
		.then(function(instance) {
			return instance.owner.call();
		})
		.then(function(result) {
			assert.equal(result, args._owner, "contract owned by " +
				"the wrong address");
		});
	});
});

contract('BettingTestOracleSet', function(accounts) {
	const null_address = '0x0000000000000000000000000000000000000000';
	const args = {_owner: accounts[1], _oracle: accounts[2],
		_other: accounts[3], _fail: null_address};

	it("The Owner can set a new Oracle", function() {
		return Betting.new({from: args._owner})
		.then(function(instance) {
			return instance.chooseOracle.call(args._oracle, {from: args._owner});
		})
		.then(function(result) {
			assert.equal(result, args._oracle, "Oracle address and test " +
				"values do not match");
		});
	});

	it("The Oracle cannot be set by non-Owner addresses", function() {
		return Betting.new({from: args._owner})
		.then(function(instance) {
			return instance.chooseOracle.call(args._oracle, {from: args._other});
		})
		.then(function(result) {
			assert.equal(result, args._fail, "Oracle address and test " +
				"values should both be uninitialized addresses");
		});
	});
});

// contract("ExampleTest", function(accounts) {
// 	const args = {_owner: accounts[1], _oracle: accounts[2],
// 		_gamblerA: accounts[3], _gamblerB: accounts[4], _other: accounts[5]};
// 	it("Deploy", function() {
// 		return Betting.new([1, 2, 3, 4], {from: args._owner})
// 		.then(function(instance){
// 			return instance.chooseOracle.call(args._oracle, {from: args._owner})
// 			.then(function(result) {
// 				assert.equal(result, args._oracle, "Oracle doesn't match");
// 				return instance.makeBet.call(1, {from: args._gamblerA, value: 50});
// 			})
// 			.then(function(result) {
// 				assert.equal(result, true, "Make Bet call didn't succeed");
// 				return instance.makeBet.call(2, {from: args._gamblerB, value: 210});
// 			})
// 			.then(function(result) {
// 				assert.equal(result, true, "Make Bet call didn't succeed");
// 				return instance.makeBet.call(3, {from: args._gamblerA, value: 10});
// 			})
// 			.then(function(result) {
// 				assert.equal(result, false, "Make Bet call incorrectly succeeded");
// 				return instance.makeBet.call(1, {from: args._other, value: 100});
// 			})
// 			.then(function(result) {
// 				assert.equal(result, false, "Make Bet call incorrectly succeeded");
// 				return instance.makeDecision.call(2, {from: args._oracle});
// 			})

// 			// instance.makeDecision.call(2, {from: args._oracle});
// 			// return instance.checkWinnings.call({from: args._gamblerB});
// 		})
// 		.then(function(result) {
// 			assert.equal(result, args._oracle, "Oracle doesn't match");
// 			return instance.makeBet.call(1, {from: args._gamblerA, value: 50});
// 		})
// 		.then(function(result) {
// 			assert.equal(result, true, "Make Bet call didn't succeed");
// 		})
		
// 		.then(function(result) {
// 			assert.equal(result, true, "MadeBet returned true");
// 			assert.equal(instance.bets[args._gamblerA].outcome, 1, "Bet outcome from GamblerA is incorrect");
// 		})
		
// 		.then(function(result) {
// 			assert.equal(result, true, "MadeBet returned true");
// 			assert.equal(instance.bets[args._gamblerB].outcome, 2, "Bet outcome from GamblerB is incorrect");
// 		})
		
// 		.then(function(result) {
// 			assert.equal(result, false, "MadeBet returned wrong value");
// 			assert.equal(instance.bets[args._gamblerA].outcome, 1, "Bet outcome from GamblerA is incorrect");
// 		})
		
// 		.then(function(result) {
// 			assert.equal(result, false, "MadeBet returned wrong value");
// 			assert.equal(instance.bets[args._other].initialized, false, "Bet outcome from GamblerG is incorrectly initialized");
// 		})
// 	});
// });
