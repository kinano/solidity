const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const srcPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const src = fs.readFileSync(srcPath, 'utf8');
const outputs = solc.compile(src, 1).contracts;

fs.ensureDirSync(buildPath);
for (let contract in outputs) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        outputs[contract]
    )
}