// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

interface ICampaignFactory {
    function createCampaign(address implement_, uint minContribution_) external
}