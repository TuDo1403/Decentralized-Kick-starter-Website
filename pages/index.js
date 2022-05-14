import React, { Component } from "react";
import { Button, Card } from "semantic-ui-react";
import factory from '../scripts/factory'
import Layout from '../components/Layout'
import { Link } from '../routes'


export default class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.getDeployedCampaigns()
        return { campaigns }
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            }
        })

        return <Card.Group items={items}></Card.Group>
    }

    render() {
        return (
            <Layout>
                <div>
                    
                    <h3>Open Campaigns</h3>
                    <Link route='/campaigns/new'>
                        <a>
                            <Button 
                                floated="right" 
                                content='Create Campaign' 
                                icon='add circle' 
                                primary>
                            </Button>
                        </a>
                    </Link>
                    {this.renderCampaigns()}
                </div>
            </Layout>
        )
        
    }
}