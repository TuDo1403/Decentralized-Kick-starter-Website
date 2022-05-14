import React, { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import Layout from '../../components/Layout'
import Campaign from '../../scripts/Campaign'
import { ethers } from "ethers";
import ContributeForm from "../../components/ContributeForm";
import { Link } from '../../routes'


export default class CampaignShow extends Component {
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address)
        const summary = await campaign.getSummary()
        return {
            address: props.query.address,
            minContribution: summary[0].toNumber(),
            balance: summary[1],
            requestCount: summary[2].toNumber(),
            approverCount: summary[3].toNumber(),
            manager: summary[4]
        }
    }

    renderCards() {
        const {
            balance,
            manager,
            minContribution,
            requestCount,
            approverCount
        } = this.props

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 
                    'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to contribute'
            },
            {
                header: requestCount,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from the contract. Request must be approved by approvers'
            },
            {
                header: approverCount,
                meta: 'Number of approvers',
                description: 'Number of people who have already donated to this campaign'
            },
            {
                header: ethers.utils.formatEther(balance),
                meta: 'Campaign balance (ether)',
                description: 'How much money is this campaign has left to spend'

            }

        ]

        return (<Card.Group items={items}/>)
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Show</h3>
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
                                    <Button primary>View requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                        
                    </Grid.Row>
                    
                </Grid>
                
            </Layout>
        )
    }
}