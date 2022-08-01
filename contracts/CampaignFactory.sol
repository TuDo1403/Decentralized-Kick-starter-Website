// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/ICampaignFactory.sol";

contract CampaignFactory is ICampaignFactory {
    using Counters for Counters.Counter;
    using Clones for address;

    uint256 private _counter;
    mapping(uint256 => address) public deployedCampaigns;

    function createCampaign(address implement_, uint minContribution_) external {
        address clone = implement_.clone();
        deployedCampaigns[_counter.increment()] = clone;
    }
}
