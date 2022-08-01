// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Context.sol";

import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

contract CampaignFactory is ICampaignFactory, Context {
    using Clones for address;
    using Counters for Counters.Counter;

    Counters.Counter private _counter;
    mapping(uint256 => address) public deployedCampaigns;

    constructor() payable {}

    function createCampaign(address implement_)
        external
        override
        returns (address clone)
    {
        if (ICampaign(implement_).factory() != address(this)) {
            revert Factory__InvalidInput();
        }
        address sender = _msgSender();
        clone = implement_.clone();
        ICampaign(clone).init(sender);
        deployedCampaigns[_counter.current()] = clone;
        _counter.increment();

        emit CampaignDeployed(clone, sender);
    }
}
