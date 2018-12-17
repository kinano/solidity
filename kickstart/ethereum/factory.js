import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // @todo @kinano Move this to a config file
    '0x8C146911780a5413d7BAcbA372C3009b396C556F'
);

export default instance;