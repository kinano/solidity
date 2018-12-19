import React, { Component } from 'react';
import { Table, Button, Message, Form } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
    campaign = Campaign(this.props.address);
    state = {
        request: this.props.request,
        id: this.props.id,
        loading: false,
        error: ''
    };

    onApprove = async (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        });
        try {
            const accounts = await web3.eth.getAccounts();
            console.log('Approving request');
            await this.campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
            // Once the request has been approved, re-fetch it from the blockchain
            await this.fetchRequest();
        }
        catch (err) {
            this.setState({
                error: err.message
            });
        }
        finally {
            this.setState({
                loading: false
            });
        }
    }

    fetchRequest = async () => {
        console.log('fetching request from the network', this.state.id);
        const request = await this.campaign.methods.requests(this.state.id).call();
        console.log('fetched request', request);
        this.setState({
            request: request
        });
    }

    render() {
        const { Row, Cell } = Table; 
        const { id, request } = this.state;
        return (
            <Row>
                <Cell>
                    {request.description}
                </Cell>
                <Cell>
                    {web3.utils.fromWei(request.value, 'ether')}
                </Cell>
                <Cell>
                    {request.recipient}
                </Cell>
                <Cell>
                    {request.approvalCount} / {this.props.approversCount}
                </Cell>
                <Cell>
                    <Button
                        color="green"
                        basic
                        onClick={this.onApprove}
                        loading={this.state.loading}
                    >
                        Approve
                    </Button>
                </Cell>
                <Cell>
                    <Form error={!!this.state.error}>
                        <Message error label="Ooops" message={this.state.error} />
                        <Button>Finalize</Button>
                    </Form>
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;