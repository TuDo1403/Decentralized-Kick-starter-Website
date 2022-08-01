// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.15;

import "./IPausable.sol";

interface ICampaign is IPausable {
    error Campaign__OnlyFactory();
    error Campaign__NonZeroValue();
    error Campaign__Unauthorized();
    error Campaign__InvalidInput();
    error Campaign__NonZeroAddress();
    error Campaign__AlreadyApproved();
    error Campaign__NotEnoughVotes();
    error Campaign__ALreadyCompleted();
    error Campaign__TransactionFailed();
    error Campaign__InsufficientPayment();

    struct Request {
        uint96 approvalsCount;
        address recipient;
        uint256 value;
    }

    event NewRequest(
        uint256 indexed id,
        address indexed recipient,
        uint256 indexed value,
        string description
    );
    event RequestDeleted(uint256 indexed id);
    event RequestCompleted(
        uint256 indexed id,
        address indexed recipient,
        uint256 indexed value,
        uint256 approvalsCount
    );

    function contribute() external payable;

    function resetCounter() external;

    function init(address owner_) external;

    function factory() external view returns (address);

    function createRequest(
        address recipient_,
        uint256 value_,
        string calldata description_
    ) external;

    function approve(uint256 idx_) external;

    function finalizeRequest(uint idx_) external;

    function removeRequest(uint256 idx_) external;

    function getSummary()
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        );
}
