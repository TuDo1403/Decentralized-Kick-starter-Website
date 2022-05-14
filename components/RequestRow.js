import { ethers } from "ethers";
import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../scripts/Campaign";
import { Router } from "../routes";


export default class RequestRow extends Component {
    state = {
        loading: false,
    }

    async executeTransaction(func) {
        const campaign = Campaign(this.props.address)
        this.setState({ loading: true })

        try {
            campaign.provider.send('eth_requestAccounts', [])
            const signer = campaign.provider.getSigner()
            const signedCampaign = campaign.connect(signer)
            await eval(`signedCampaign.${func}`)
        } catch (err) {
            alert(err.message)
        } finally {
            this.setState({ loading: false })
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`)
        }
    }

    onApprove = async (event) => {
        await this.executeTransaction(`approve(${this.props.id})`)
    }

    onFinalize = async (event) => {
        await this.executeTransaction(`finalizeRequest(${this.props.id})`)
    }

    render() {
        const { Row, Cell } = Table
        const { id, request, approversCount } = this.props
        // try {
        //     approversCount = approversCount === undefined ? 0 : approversCount
        // } catch (err) {
        //     console.log(err.message)
        //     console.log(approversCount)
        //     console.log(typeof approversCount)
        //     approversCount = 0
        // }
        
        let approvalsCount = request.approvalsCount
        approvalsCount = request.approvalsCount.toNumber()
        const value = ethers.utils.formatEther(request.value)
        const readyToFinalize = request.approvalsCount > approversCount / 2
        console.log(request.isCompleted)
        return (
            <Row disabled={request.isCompleted} positive={readyToFinalize && !request.isCompleted}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{value}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{approvalsCount}/{approversCount}</Cell>
                <Cell>
                    { request.isCompleted ? null : (
                        <Button 
                            loading={this.state.loading} 
                            color="green" 
                            basic 
                            onClick={this.onApprove}>Approve
                        </Button>
                    )}
                </Cell>
                <Cell>
                    { request.isCompleted ? null : (
                        <Button 
                            loading={this.state.loading} 
                            color='teal' 
                            basic 
                            onClick={this.onFinalize}>Finalize
                        </Button>

                    )}
                </Cell>
            </Row>
        )
    }
}