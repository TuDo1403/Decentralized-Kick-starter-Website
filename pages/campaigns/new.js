import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from '../../scripts/factory'
import { Link, Router } from '../../routes'

export default class NewCampaign extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault()
        this.setState({ loading: true, errorMessage: '' })
        try {
            await factory.provider.send("eth_requestAccounts", [])
            const signer = factory.provider.getSigner()
            const signedFactory = factory.connect(signer)
            await signedFactory.createCampaign(this.state.minimumContribution)
            Router.pushRoute('/')
        } catch (err) {
            this.setState({ errorMessage: err.message })
        } finally {
            this.setState({ loading: false })
        }
        
    }
    render () {
        return (
            <Layout>
                <h3>New Campaigns</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label='wei' 
                            labelPosition="right" 
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({ minimumContribution: event.target.value })}
                        />

                    </Form.Field>
                    <Message error header='Oops!' content={this.state.errorMessage}/>
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
            
        )
    }
}