// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

interface ICampaignFactory {
    error Factory__InvalidInput();

    event CampaignDeployed(address indexed clone, address indexed owner);

    function createCampaign(address implement_) external returns (address);
}
