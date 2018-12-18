import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // @todo @kinano Move this to a config file
    '0x3e507cafe46160cFB0088eD1caafeB9B7Fd949B5'
);

export default instance;