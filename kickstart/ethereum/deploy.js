// Pass the eth secret as an arg
// example: node deploy.js "boo ha ha ha ha ha ho"
const ethSecret = process.argv[2];
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
    ethSecret,
    // @todo @kinano Move to config
    'https://rinkeby.infura.io/v3/3857f9f33a75447490c80c05e7976d27'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from ', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            gas: 1000000,
            from: accounts[0]
        });
    console.log('Contract deployed to ', result.options.address)
};

deploy();