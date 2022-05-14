import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../scripts/Campaign";
import { ethers } from "ethers";
import { Router } from "../routes";


export default class ContributeForm extends Component {
    state = {
        value: '',
        loading: false,
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault()
        this.setState({ loading: true, errorMessage: '' })
        const campaign = Campaign(this.props.address)
        try {
            campaign.provider.send("eth_requestAccounts", [])
            const signer = campaign.provider.getSigner()
            const signedCampaign = campaign.connect(signer)
            await signedCampaign.contribute({ value: ethers.utils.parseEther(this.state.value) })

            Router.replaceRoute(`/campaigns/${this.props.address}`)
        } catch (err) {
            this.setState({ errorMessage: err.message })
        } finally {
            this.setState({ loading: false })
        }
        
        
        
    }
    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input 
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                        label='ether' 
                        labelPosition='right'
                    />
                </Form.Field>
                <Message error header='Oops!' content={this.state.errorMessage}/>
                <Button loading={this.state.loading} primary>Contribute</Button>
            </Form>
        )
    }
}