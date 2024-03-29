// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import {IEntryPoint} from "https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/interfaces/IEntryPoint.sol";
import {UserOperation} from "https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/UserOperationLib.sol";
import {BaseAccount as BaseERC4337Account} from "https://github.com/eth-infinitism/account-abstraction/blob/develop/contracts/core/BaseAccount.sol";

import "../utils/Errors.sol";

/**
 * @title ERC-4337 Support
 * @dev Implements ERC-4337 account support
 */
abstract contract ERC4337Account is BaseERC4337Account {
    using ECDSA for bytes32;

    IEntryPoint immutable _entryPoint;

    constructor(address entryPoint_) {
        if (entryPoint_ == address(0)) revert InvalidEntryPoint();
        _entryPoint = IEntryPoint(entryPoint_);
    }

    /**
     * @dev See {BaseERC4337Account-entryPoint}
     */
    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }

    /**
     * @dev See {BaseERC4337Account-_validateSignature}
     */
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal
        view
        virtual
        override
        returns (uint256)
    {
        if (_isValidSignature(_getUserOpSignatureHash(userOp, userOpHash), userOp.signature)) {
            return 0;
        }

        return 1;
    }

        function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
            return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        }

    /**
     * @dev Returns the user operation hash that should be signed by the account owner
     */
    function _getUserOpSignatureHash(UserOperation calldata, bytes32 userOpHash)
        internal
        view
        virtual
        returns (bytes32)
    {
        return toEthSignedMessageHash(userOpHash);
    }

    function _isValidSignature(bytes32 hash, bytes calldata signature)
        internal
        view
        virtual
        returns (bool);
}
