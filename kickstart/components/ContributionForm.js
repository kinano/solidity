import React, { Component } from 'react';
import { Form, Input, Message, FormField, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributionForm extends Component {
    state = {
        value: '',
        loading: false,
        error: ''
    };

    onSubmit = async (e) => {
        e.preventDefault();
        this.setState({
            loading: true
        });
        const campaign = Campaign(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.replaceRoute(`/campaigns/${this.props.address}`);
            this.setState({ value: '' });
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
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.error}>
                <FormField>
                    <label>
                        Amount to contribute
                    </label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={this.state.value}
                        onChange={(e) => { this.setState({ value: e.target.value }) }}
                    />
                </FormField>
                <Message error header="Oops" content={this.state.error} />
                <Button primary loading={this.state.loading}>
                    Contribute
                </Button>
            </Form>
        );
    }
}

export default ContributionForm;