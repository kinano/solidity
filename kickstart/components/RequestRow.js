import React, { Component } from 'react';
import { Table, Button, Message, Form } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';

class RequestRow extends Component {
    campaign = Campaign(this.props.address);
    state = {
        request: this.props.request,
        id: this.props.id,
        loading: '',
        error: ''
    };

    onApprove = async (e) => {
        e.preventDefault();
        this.setState({
            loading: 'approve'
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
                loading: ''
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

    onFinalize = async (e) => {
        e.preventDefault();
        console.log('finalizing request');
        try {
            this.setState({
                loading: 'finalize'
            });
            const accounts = await web3.eth.getAccounts();
            await this.campaign.methods.finalizeRequest(this.state.id).send({
                from: accounts[0]
            });
            await this.fetchRequest();
        }
        catch (err) {
            this.setState({
                error: err.message
            });
        }
        finally {
            this.setState({
                loading: ''
            });
        }
    }

    render() {
        const { Row, Cell } = Table; 
        const { request } = this.state;
        const readyToFinalize = request.approvalCount > this.props.approversCount / 2;
        return (
            <Row disabled={request.complete} positive={!request.complete && readyToFinalize}>
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
                    {request.complete ? null : (
                        <Button
                            color="green"
                            basic
                            onClick={this.onApprove}
                            loading={this.state.loading === 'approve'}
                        >
                            Approve
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button
                            disabled={!(readyToFinalize)}
                            color="orange"
                            basic
                            loading={this.state.loading === 'finalize'}
                            onClick={this.onFinalize}>
                            Finalize
                        </Button>
                    )}
                </Cell>
                <Cell>
                    <Form error={!!this.state.error}>
                        <Message error label="Ooops" content={this.state.error} />
                    </Form>
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;