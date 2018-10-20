import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import {Link, Router} from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign'
import web3 from '../../../ethereum/web3'

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading : false,
        errorMessage : ''

    };
    onFormSubmit = async (event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        const {description, value, recipient} = this.state;

        this.setState({loading : true , errorMessage : ''});
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({from: accounts[0]});

            Router.pushRoute(`campaigns/${this.props.address}/requests`);

        } catch (e) {
            this.setState({errorMessage :  e.message});
        }

        this.setState({loading:false});

    };

    static async getInitialProps(props) {
        const {address} = props.query;

        return {address};
    };

    render() {
        return (
            <Layout>
                <Link route = {`campaigns/${this.props.address}/requests`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h2>Fill in the details to create withdrawing funds request.</h2>
                <Form onSubmit={this.onFormSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description </label>
                        <Input
                            onChange={event => this.setState({description: event.target.value})}
                            value={this.state.description}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value (In ether) </label>
                        <Input
                            onChange={event => this.setState({value: event.target.value})}
                            value={this.state.value}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            onChange={event => this.setState({recipient: event.target.value})}
                            value={this.state.recipient}
                        />
                    </Form.Field>
                    <Message error header ='Oops!' content={this.state.errorMessage}/>
                    <Button primary loading={this.state.loading}>Create!</Button>
                </Form>

            </Layout>
        );

    }
}

export default RequestNew;