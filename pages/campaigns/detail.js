import React, {Component} from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import {Card, Grid, Button} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import {Link} from '../../routes';
import ContributeForm from '../../components/ContributeForm';

class CampaignDetail extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.getSummary().call();

        return {
            address: props.query.address,
            balance: summary[0],
            minimumContribution: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            minimumContribution,
            requestsCount,
            approversCount,
            manager
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager who created this campaign and can request to withdraw money',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to being marked as an contributor to this campaign',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: requestsCount,
                meta: 'Number of requests for withdrawing money',
                description: "A request tries to withdraw money from contracts . Requests must be approved by contributors",
                style: {overflowWrap: 'break-word'}
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: "Number of people who have already to this campaign",
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'How much money this campaign has left to spend.'
            }

        ];

        return <Card.Group items={items}/>


    };

    render() {
        return (
            <Layout>
                <h1>Campaign Details</h1>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
    };

}

export default CampaignDetail;