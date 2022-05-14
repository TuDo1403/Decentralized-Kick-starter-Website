import React, { Component } from "react";
import Campaign from "../../../scripts/Campaign";
import { Link, Router } from '../../../routes'
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import { ethers } from "ethers";

export default class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false, 
        errorMessage: ''
    }


    static async getInitialProps(props) {
        const { address } = props.query
        
        return { address }
    }

    onSubmit = async (event) => {
        event.preventDefault()
        this.setState({ loading: true, errorMessage: '' })
        const campaign = Campaign(this.props.address)
        const { description, value, recipient } = this.state

        try {
            await campaign.provider.send("eth_requestAccounts", [])
            const signer = campaign.provider.getSigner()
            const signedCampaign = campaign.connect(signer)
            await signedCampaign.createRequest(
                description, 
                ethers.utils.parseEther(value), 
                recipient
            )

            
        } catch (err) {
            this.setState({ errorMessage: err.message })
        } finally {
            this.setState({ loading: false })
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
        }
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        Back
                    </a>
                </Link>
                <h3>Create a request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.description} 
                            onChange=
                                {event => this.setState({ description: event.target.value })}>
                        </Input>
                    </Form.Field>

                    <Form.Field>
                        <label>Value in ether</label>
                        <Input 
                            value={this.state.value} 
                            onChange=
                                {event => this.setState({ value: event.target.value })}>
                        </Input>
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            value={this.state.recipient} 
                            onChange=
                                {event => this.setState({ recipient: event.target.value })}>
                        </Input>
                    </Form.Field>

                    <Button loading={this.state.loading} primary>Create!</Button>
                    <Message error content={this.state.errorMessage}/>
                </Form>
            </Layout>
            
        )
    } 
}