import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class NewRequest extends Component {

    state = {
        value: '',
        description: '',
        recipient: '',
        error: '',
        loading: false
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        return { address };
    }

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        });
        const campaign = Campaign(this.props.address);
        const accounts = await web3.eth.getAccounts();
        const { description, value, recipient } = this.state;
        try {
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${this.props.address}/requests`)
        }
        catch (err) {
            this.setState({
                error: err.message
            })
        }
        finally {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <Layout>
                <h3>Add a request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.error}>
                    <Form.Field>
                        <label>
                            Description
                        </label>
                        <Input
                            value={this.state.description}
                            onChange={(e) => {this.setState({description: e.target.value})}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>
                            Value (ether)
                        </label>
                        <Input
                            value={this.state.value}
                            onChange={(e) => { this.setState({ value: e.target.value })}}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>
                            Recipient
                        </label>
                        <Input
                            value={this.state.recipient}
                            onChange={(e)=>{this.setState({recipient: e.target.value})}}
                        />
                    </Form.Field>
                    <Message error label="Oops" content={this.state.error}></Message>
                    <Button primary loading={this.state.loading}>
                        Create
                    </Button>
                </Form>
            </Layout>
        );
    }

}

export default NewRequest;
