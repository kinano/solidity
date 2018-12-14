const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts = [],
    factory,
    campaignAddress,
    campaign
;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // Take the first element of the deployed campaigns array and stick it in campaignAddress
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    // Create a new contract out of the compiled campaign interface and the newly created campaign address
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('kickstart campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows peeps to contribute and become approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });
        const isContributer = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributer);
    });

    it('Enforces minimum contribution rules', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '10'
            });
            assert(false)
        }
        catch (err) {
            assert(err);
        }
    });

    it('allows manager to request a payment', async () => {
        await campaign.methods.createRequest(
            'haha',
            '100',
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.description, 'haha');
    });

    it('processes requests', async () => {
        const manager = accounts[0];
        const approver = accounts[1];
        const recipient = accounts[2];
        await campaign.methods.contribute().send({
            from: approver,
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.createRequest(
            'a',
            web3.utils.toWei('5', 'ether'),
            recipient
        ).send({
            from: manager,
            gas: 1000000
        });
        await campaign.methods.approveRequest(0).send({
            from: approver,
            gas: 1000000
        });
        await campaign.methods.finalizeRequest(0).send({
            from: manager,
            gas: '1000000'
        });
        let balance = await web3.eth.getBalance(recipient);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        assert(balance === 105);
    });

});