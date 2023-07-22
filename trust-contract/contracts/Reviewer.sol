// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {SchemaResolver} from "./SchemaResolver.sol";
import {Attestation} from "./helpers/Common.sol";

contract Reviewer is SchemaResolver {
    using ByteHasher for bytes;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERRORS                                ///
    //////////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _eas The EAS instance that will be used for deploying attestations
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    constructor(
        IWorldID _worldId,
        address _eas,
        string memory _appId,
        string memory _actionId
    ) SchemaResolver(_eas) {
        worldId = _worldId;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    function onAttest(
        Attestation memory attestation,
        uint256 value
    ) public onlyEAS {
        (
            bytes32 uid,
            bytes32 schema,
            uint64 time,
            uint64 expirationTime,
            uint64 revocationTime,
            bytes32 refUID,
            address recipient,
            address attester,
            bool revocable,
            bytes data
        ) = attestation.data;

        // params = abi.decode(data)

        bytes memory signal = abi.encodePacked(msg.sender, attestation.data);
        return verifyAndExecute(signal, root, nullifierHash, proof);
    }

    /// @param signal An arbitrary input from the user, usually the user's wallet address (check README for further details)
    /// @param root The root of the Merkle tree (returned by the JS widget).
    /// @param nullifierHash The nullifier hash for this proof, preventing double signaling (returned by the JS widget).
    /// @param proof The zero-knowledge proof that demonstrates the claimer is registered with World ID (returned by the JS widget).
    function verifyAndExecute(
        bytes memory signal,
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) public {
        // First, we make sure this person hasn't done this before
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // We now verify the provided proof is valid and the user is verified by World ID
        // Reverts if it fails
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(signal).hashToField(),
            nullifierHash,
            externalNullifier,
            proof
        );

        // We now record the user has done this, so they can't do it again (proof of uniqueness)
        nullifierHashes[nullifierHash] = true;

        return true;
    }

    function onRevoke(
        Attestation memory attestation,
        uint256 value
    ) public onlyEAS {
        return true;
    }
}
