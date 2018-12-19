import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // @todo @kinano Move this to a config file
    '0x817F15e929Dd58e930510737B56ED376F4599899'
);

export default instance;