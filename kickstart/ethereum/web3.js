import Web3 from 'web3';

let provider;
try {
    // @todo @kinano Add a login screen to avoid having to rely on meta mask
    // Try to load the provider from the window object if the user has meta mask installed
    provider = window.web3.currentProvider;
}
catch (err) {
    // Server side rendering will blow up because we won't have a window object
    provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/3857f9f33a75447490c80c05e7976d27'
    );
}
const web3 = new Web3(provider);

export default web3;