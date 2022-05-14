// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public {
        address campaign = address(new Campaign(minContribution, msg.sender));
        deployedCampaigns.push(campaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}