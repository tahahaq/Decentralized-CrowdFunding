import React, {Component} from 'react';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import Layout from '../../components/Layout'
import factory from '../../ethereum/factory'
import {Link , Router} from '../../routes';
import web3 from '../../ethereum/web3';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading : false,
        disableStatus : false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        this.setState({loading : true  , disableStatus : true});
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCampaign(this.state.minimumContribution)
                .send({
                    from: accounts [0]
                });
            Router.pushRoute('/');
        } catch (e) {
            this.setState({errorMessage: e.message});
        }
        this.setState({loading : false , disableStatus : false})



    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="wei"
                            labelPosition="right"
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({minimumContribution: event.target.value})
                            }
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button disabled={this.state.disableStatus} loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        )
    }

}

export default CampaignNew;