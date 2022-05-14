/* eslint-disable jest/valid-expect */
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')
const { ethers } = require('hardhat')
const campaignArtifact = require('../artifacts/contracts/Campaign.sol/Campaign.json')
const campaignFactoryArtifact = require('../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json')


let signers, campaignFactory, campaign, signedCampaign0, signedCampaign1

beforeEach(async () => {
    signers = await ethers.getSigners()
    const owner = signers[0]
    const CampaignFactory = await ethers.getContractFactoryFromArtifact(
        campaignFactoryArtifact,
        owner
    )
    campaignFactory = await CampaignFactory.deploy()

    await campaignFactory.deployed()

    const signedCampaignFactory = campaignFactory.connect(owner)
    await signedCampaignFactory.createCampaign(100)

    const [campaignAddress] = await campaignFactory.getDeployedCampaigns()
    campaign = new ethers.Contract(
        campaignAddress,
        campaignArtifact.abi,
        signers[1]
    )
    
    signedCampaign0 = campaign.connect(signers[0])
    signedCampaign1 = campaign.connect(signers[1])
})


describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        expect(campaignFactory.address).to.be.ok
        expect(campaign.address).to.be.ok
    })

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.manager()
        expect(manager).to.equal(signers[0].address)
    })

    it('allows people to contribute money and marks them as approvers', async () => {
        await signedCampaign1.contribute({ value: 200 })
        const isContributor = await campaign.approvers(signers[1].address)
        expect(isContributor).to.be.ok
    })

    it('requires a minimum contribution', async () => {
        try {
            await signedCampaign1.contribute({ value: 5 })
            expect.to.fail()
        } catch (err) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(err)
        }
    })

    it('allows a manager to make a payment request', async () => {
        await signedCampaign0.createRequest(
            'Buy batteries',
            100,
            signers[2].address
        )

        const request = await campaign.requests(0)
        expect(request.description).to.equal('Buy batteries')
    })

    it('processes requests', async () => {
        await signedCampaign1.contribute({ value: ethers.utils.parseEther('10') })
        await signedCampaign0.createRequest(
            'A',
            ethers.utils.parseEther('5'),
            signers[2].address
        )

        await signedCampaign1.approve(0)
        await signedCampaign0.finalizeRequest(0)
        const balance = ethers.utils.formatEther(await signers[2].getBalance())
        expect(parseFloat(balance)).to.be.greaterThan(10004)
    })
})