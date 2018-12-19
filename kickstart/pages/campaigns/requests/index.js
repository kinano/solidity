import React, { Component } from 'react';
import Layout from '../../../components/Layout';
import { Button, Table, Tab } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';
class RequestsIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call()
            })
        )
        return { address, requests, requestCount, approversCount };
    }

    getRows = () => {
        return this.props.requests.map((r, index) => {
            return (
                <RequestRow
                    request={r}
                    key={index}
                    address={this.props.address}
                    id={index}
                    approversCount={this.props.approversCount}
                />
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>
                                ID
                            </HeaderCell>
                            <HeaderCell>
                                Description
                            </HeaderCell>
                            <HeaderCell>
                                Amount
                            </HeaderCell>
                            <HeaderCell>
                                Approvals
                            </HeaderCell>
                            <HeaderCell>
                                Approve
                            </HeaderCell>
                            <HeaderCell>
                                Finalize
                            </HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.getRows()}</Body>
                </Table>
            </Layout>
        );
    }
}

export default RequestsIndex;