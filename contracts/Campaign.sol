// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

import "./interfaces/ICampaign.sol";

contract Campaign is ICampaign, Ownable, Pausable, Initializable {
    using Counters for Counters.Counter;

    address public immutable factory;
    uint256 public immutable minContribution;

    uint256 public numApprovers;

    Counters.Counter private _requestCount;

    mapping(address => bool) public approvers;
    mapping(uint256 => Request) public requests;
    mapping(uint256 => mapping(address => bool)) public approvalsPerRequest;

    constructor(address factory_, uint256 minContribution_) payable {
        _nonZeroAddress(factory_);
        _nonZeroValue(minContribution_);

        factory = factory_;
        minContribution = minContribution_;
    }

    function contribute() external payable override whenNotPaused {
        if (msg.value < minContribution) {
            revert Campaign__InsufficientPayment();
        }
        unchecked {
            ++numApprovers;
        }
        approvers[_msgSender()] = true;
    }

    function init(address owner_) external override initializer {
        if (_msgSender() != factory) {
            revert Campaign__OnlyFactory();
        }
        _transferOwnership(owner_);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function createRequest(
        address recipient_,
        uint256 value_,
        string calldata description_
    ) external override onlyOwner whenNotPaused {
        _nonZeroAddress(recipient_);
        _nonZeroValue(value_);

        Request memory request = Request({
            recipient: recipient_,
            value: value_,
            approvalsCount: 0
        });
        uint256 id = _requestCount.current();
        requests[id] = request;
        _requestCount.increment();

        emit NewRequest(id, recipient_, value_, description_);
    }

    function approve(uint256 idx_) external override whenNotPaused {
        address sender = _msgSender();
        if (!approvers[sender]) {
            revert Campaign__Unauthorized();
        }
        if (approvalsPerRequest[idx_][sender]) {
            revert Campaign__AlreadyApproved();
        }
        unchecked {
            ++requests[idx_].approvalsCount;
        }
        approvalsPerRequest[idx_][sender] = true;
    }

    function finalizeRequest(uint256 idx_)
        external
        override
        onlyOwner
        whenNotPaused
    {
        if (idx_ > _requestCount.current()) {
            revert Campaign__InvalidInput();
        }
        Request memory request = requests[idx_];
        uint256 requestValue = request.value;
        if (requestValue == 0) {
            revert Campaign__ALreadyCompleted();
        }
        unchecked {
            if (request.approvalsCount < (numApprovers >> 1)) {
                revert Campaign__NotEnoughVotes();
            }
        }

        (bool ok, ) = payable(request.recipient).call{value: requestValue}("");
        if (!ok) {
            revert Campaign__TransactionFailed();
        }
        _removeRequest(idx_);
        emit RequestCompleted(
            idx_,
            request.recipient,
            requestValue,
            request.approvalsCount
        );
    }

    function resetCounter() external override onlyOwner whenPaused {
        _requestCount.reset();
    }

    function removeRequest(uint256 idx_) external onlyOwner whenPaused {
        _removeRequest(idx_);
        emit RequestDeleted(idx_);
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
            _requestCount.current(),
            numApprovers,
            owner()
        );
    }

    function _removeRequest(uint256 idx_) internal {
        delete requests[idx_];
    }

    function _nonZeroAddress(address addr_) internal pure {
        if (addr_ == address(0)) {
            revert Campaign__NonZeroAddress();
        }
    }

    function _nonZeroValue(uint256 val_) internal pure {
        if (val_ == 0) {
            revert Campaign__NonZeroValue();
        }
    }
}
