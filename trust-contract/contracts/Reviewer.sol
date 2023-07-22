// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import {ByteHasher} from "./helpers/ByteHasher.sol";
import {IWorldID} from "./interfaces/IWorldID.sol";
import {IEAS, AttestationRequest, AttestationRequestData} from "./interfaces/IEAS.sol";

contract Reviewer {
    using ByteHasher for bytes;

    ///////////////////////////////////////////////////////////////////////////////
    ///                                  ERRORS                                ///
    //////////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when attempting to reuse a nullifier
    error InvalidNullifier();

    /**
     * @dev Emitted when an attestation has been made.
     *
     * @param recipient The recipient of the attestation.
     * @param attester The attesting account.
     * @param uid The UID the revoked attestation.
     * @param schema The UID of the schema.
     */
    event Attested(
        address indexed recipient,
        address indexed attester,
        bytes32 uid,
        bytes32 indexed schema
    );

    /// @dev The World ID instance that will be used for verifying proofs
    IWorldID internal immutable worldId;

    /// @dev The contract's external nullifier hash
    uint256 internal immutable externalNullifier;

    /// @dev The World ID group ID (always 1)
    uint256 internal immutable groupId = 1;

    /// @dev The EAS instance that will be used for deploying attestations
    IEAS internal immutable EAS;

    bytes32 public easSchema;

    /// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
    mapping(uint256 => bool) internal nullifierHashes;

    /// @param _worldId The WorldID instance that will verify the proofs
    /// @param _eas The EAS instance that will be used for deploying attestations
    /// @param _appId The World ID app ID
    /// @param _actionId The World ID action ID
    /// @param _easSchema The EAS schema ID
    constructor(
        IWorldID _worldId,
        IEAS _eas,
        string memory _appId,
        string memory _actionId,
        bytes32 _easSchema
    ) {
        worldId = _worldId;
        EAS = _eas;
        easSchema = _easSchema;
        externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
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

        (
            address recipient,
            uint64 expirationTime,
            bytes32 refUID,
            bytes memory data,
            uint256 value
        ) = abi.decode(signal, (address, uint64, bytes32, bytes, uint256));

        _attest(recipient, expirationTime, refUID, data, value);
    }

    /// @param recipient The recipient of the attestation.
    /// @param expirationTime The expiration time of the attestation.
    /// @param refUID The UID of the reference attestation.
    /// @param data The data of the attestation.
    /// @param value The value of the attestation.
    function _attest(
        address recipient,
        uint64 expirationTime,
        bytes32 refUID,
        bytes memory data,
        uint256 value
    ) internal {
        AttestationRequestData memory reqData = AttestationRequestData(
            recipient,
            expirationTime,
            true,
            refUID,
            data,
            value
        );

        AttestationRequest memory request = AttestationRequest(
            easSchema,
            reqData
        );

        EAS.attest(request);

        emit Attested(recipient, msg.sender, refUID, easSchema);
    }
}
