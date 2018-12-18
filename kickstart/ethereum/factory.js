import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // @todo @kinano Move this to a config file
    '0x94E12758e0e005695992298fe3Dc85542B60fFDD'
);

export default instance;