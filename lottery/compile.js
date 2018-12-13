const path = require('path');
const fs = require('fs');
const solc = require('solc');

const srcPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const src = fs.readFileSync(srcPath, 'utf8').toString();

// We only care about the Lottery contract
module.exports = solc.compile(src, 1).contracts[":Lottery"];