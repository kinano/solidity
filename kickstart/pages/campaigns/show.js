import React, { Component } from 'react';
import Layout from '../../components/Layout';
import CampaignGetter from '../../ethereum/campaign';
import { Card, Grid } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributionForm from '../../components/ContributionForm';
class CampaignShow extends Component {

    static async getInitialProps(props) {
        const campaign = await CampaignGetter(props.query.address);
        const summary = await campaign.methods.getSummary().call();
        return {
            minimumContribution: summary[0],
            balance: web3.utils.fromWei(summary[1], 'ether'),
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
            address: props.query.address
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
                style: { overflowWrap: 'break-word' },
                key: 'manager'
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: "You must contribute at least this much wei",
                key: 'contribution'
            },
            {
                header: balance,
                meta: 'Balance in Ether',
                key: 'balance'
            },
            {
                header: requestsCount,
                meta: 'Number of requests',
                key: 'requestCount'
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                key: 'approverCount'
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
                <Grid>
                    <Grid.Column width="10">
                        {this.getDetails()}
                    </Grid.Column>
                    <Grid.Column width="6">
                        <ContributionForm
                            address={this.props.address}
                        />
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;