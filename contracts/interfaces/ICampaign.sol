// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

interface ICampaign {
    error Campaign__Unauthorized();
    error Campaign__AlreadyApproved();
    error Campaign__NotEnoughVotes();
    error Campaign__ALreadyCompleted();
    error Campaign__TransactionFailed();

    struct Request {
        uint256 value;
        uint64 approvalsCount;
        bool isCompleted;
        address recipient;
        string description;
        mapping(address => bool) approvals;
    }

    function contribute() external payable;
    function createRequest(string calldata description_, uint256 value_, address recipient_) external;
    function approve(uint256 idx_) external;
    function finalizeRequest(uint idx_) external;
    function getSummary() external view returns (uint256, uint256, uint256, uint256, address);
}
