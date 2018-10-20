import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';
import {Router} from '../routes'

class ContributeForm extends Component {

    state = {
        contributionValue: '',
        errorMessage : '',
        loading : false
    };

    onContribution = async (event) => {
        event.preventDefault();
        this.setState({loading : true , errorMessage : ''});
        const campaign = Campaign(this.props.address);
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.contributionValue, 'ether')
            });
            Router.replaceRoute(`/campaign/${this.props.address}`);
        } catch (err) {
           this.setState({errorMessage : err.message});
        }
        this.setState({loading : false , contributionValue : ''});
    };

    render() {
        return (
            <Form onSubmit={this.onContribution} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        label='ether'
                        value={this.state.contributionValue}
                        onChange={event => this.setState({contributionValue: event.target.value})}
                        labelPosition="right"/>
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage}/>
                <Button primary loading={this.state.loading}> Contribute!</Button>
            </Form>
        );
    }
}

export default ContributeForm;