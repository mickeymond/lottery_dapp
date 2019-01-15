var Lottery = artifacts.require("./Lottery.sol");

contract('Election', function(accounts) {
    it('Initializes with the right info', async function() {
        const lotteryInstance = await Lottery.deployed();
        const manager = await lotteryInstance.manager();
        assert.equal(manager, accounts[0]);
    });

    it('Enters lottery successfully', async function() {
        const player = accounts[1];
        const bid = 10000000000000000;
        const lotteryInstance = await Lottery.deployed();
        await lotteryInstance.enter({ from: player, value: bid });
    });
});
