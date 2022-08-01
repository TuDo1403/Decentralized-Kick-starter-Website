// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

import "./interfaces/ICampaign.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Campaign is ICampaign, Ownable, ReentrancyGuard {
    uint256 public immutable minContribution;

    uint256 public approversCount;
    uint256 private _requestCount;

    mapping(uint => Request) public requests;
    mapping(address => bool) public approvers;

    constructor(uint256 _minContribution) payable Ownable() ReentrancyGuard() {
        minContribution = _minContribution;
    }

    function contribute() external payable nonReentrant {
        address sender = _msgSender();
        require(sender > minContribution);

        approvers[sender] = true;
        unchecked {
            ++approversCount;
        }
    }

    function createRequest(
        string calldata description_,
        uint256 value_,
        address recipient_
    ) external onlyOwner {
        unchecked {
            Request memory request = requests[++_requestCount];
        }

        request.description = description_;
        request.value = value_;
        request.recipient = recipient_;
    }

    function approve(uint256 idx_) external nonReentrant {
        address sender = _msgSender();
        Request storage request = requests[idx_];

        if (!approvers[sender]) {
            revert Campaign__Unauthorized();
        }
        if (request.approvals[sender]) {
            revert Campaign__AlreadyApproved();
        }

        unchecked {
            ++request.approvalsCount;
        }

        request.approvals[sender] = true;
    }

    function finalizeRequest(uint256 idx_) external onlyOwner {
        Request memory request = requests[idx_];

        uint256 _approversCount = approversCount;
        if (request.approvalsCount < (_approversCount >> 1)) {
            revert Campaing__NotEnoughVotes();
        }
        if (request.isCompleted) {
            revert Campaign__ALreadyCompleted();
        }
        (bool ok, ) = payable(request.recipient).call{value: request.value}("");
        if (!ok) {
            revert Campaign__TransactionFailed();
        }
        request.isCompleted = true;
    }

    function getSummary()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minContribution,
            address(this).balance,
            _requestCount,
            approversCount,
            owner()
        );
    }
}
