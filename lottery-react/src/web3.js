import Web3 from 'web3';

// Rip out the provider used by MetaMask on the browser (this assumes the user has metamask installed)
const web3 = new Web3(window.web3.currentProvider);

export default web3;