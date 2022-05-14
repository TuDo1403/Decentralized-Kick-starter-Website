import {Link} from "../../../routes";
import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import Campaign from "../../../scripts/Campaign";
import RequestRow from "../../../components/RequestRow";

export default class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query
        const campaign = Campaign(address)
        const requestCount = (await campaign.getRequestCount()).toNumber()
        const requests = await Promise.all(
            [...Array(requestCount).keys()].map(idx => campaign.requests(idx))
        )
        const approversCount = (await campaign.approversCount()).toNumber()
        return { address, requests, requestCount, approversCount }
    }

    renderRows() {
        return this.props.requests.map((request, idx) => {
            return (
                <RequestRow
                    key={idx}
                    id={idx}
                    request={request}
                    approversCount={this.props.approversCount}
                    address={this.props.address}
                ></RequestRow>
            )
        })
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table
        return (
            <Layout>
                <h3>Request</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button style={ { marginBottom: 10 }} floated="right" primary>Add a request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requests </div>
            </Layout>
        )
    }
}