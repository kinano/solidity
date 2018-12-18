import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // @todo @kinano Move this to a config file
    '0xeF2532820CC0a96BE4291B5FcE5247C11b8575E0'
);

export default instance;