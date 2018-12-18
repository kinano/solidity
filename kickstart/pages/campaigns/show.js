import React, { Component } from 'react';
import Layout from '../../components/Layout';
import CampaignGetter from '../../ethereum/campaign';
import { Card } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaign = await CampaignGetter(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        console.error(summary);
        return {
            minimumContribution: summary[0],
            balance: web3.utils.fromWei(summary[1], 'ether'),
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    getDetails() {
        const {
            minimumContribution,
            balance,
            requestsCount,
            approversCount,
            manager
        } = this.props;
        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'Manager blah blah',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: "You must contribute at least this much wei"
            },
            {
                header: balance,
                meta: 'Balance in Ether'
            },
            {
                header: requestsCount,
                meta: 'Number of requests'
            },
            {
                header: approversCount,
                meta: 'Number of approvers'
            }
        ]
        return (
            <Card.Group items={items} />
        );

    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>
                {this.getDetails()}
            </Layout>
        );
    }
}

export default CampaignShow;