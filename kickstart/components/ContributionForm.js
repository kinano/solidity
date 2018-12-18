import React, { Component } from 'react';
import { Form, Input, Message, FormField, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

class ContributionForm extends Component {
    state = {
        value: '',

    };

    onSubmit = async (e) => {
        e.preventDefault();
        const campaign = Campaign(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
        }
        catch (err) {
            console.error(err);
        }
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit}>
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
                <Button primary>
                    Contribute
                </Button>
            </Form>
        );
    }
}

export default ContributionForm;