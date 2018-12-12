const assert = require('assert');
const ganache = require('ganache-cli');
// web3 is imported as a constructor
const Web3 = require('web3');
const provider = ganache.provider();
// Create an instance of Web3 using the network provider
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts = [];
let inbox;

beforeEach( async () => {
    // Get a list of all of the available accounts on Ganache
    accounts = await web3.eth.getAccounts(); 
    // Use one of the accounts to deploy our contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            // These are the args for the contract constructor
            arguments: ['Hi there!']
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        })
});

describe('Inbox', () => {

    // Make sure the contract has been deployed and assigned an address
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    // Test the default message
    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hi there!');
    });

    // Test setting the contract message
    it('sets a message', async () => {
        await inbox.methods.setMessage('hahahaha!').send({
            from: accounts[0]
        });
        const message = await inbox.methods.message().call();
        assert.equal(message, 'hahahaha!');
    });
});