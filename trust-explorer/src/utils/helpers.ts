import { ethers } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const EAS_CONTRACT_ADDRESS = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84";
const eas = new EAS(EAS_CONTRACT_ADDRESS);

export function generateSignal() {
  const attester = ""; // USER ADDRESS
  const contract = ""; // CONTRACT ADDRESS
  const score = 7; // SCORE

  return ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint8"],
    [attester, contract, score]
  );
}

export async function generateAttestation(
  root: string,
  proof: string,
  nullifierHash: string
) {
  // TODO:: eas.connect(signer)

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "uint8 score,uint256 root,uint256 nullifierHash,uint256[8] memory proof"
  );

  const encodedData = schemaEncoder.encodeData([
    { name: "score", value: 7, type: "uint8" },
    { name: "root", value: root, type: "uint256" },
    { name: "nullifierHash", value: nullifierHash, type: "uint256" },
    { name: "proof", value: proof, type: "uint256[8] memory proof" },
  ]);

  const schemaUID =
    "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995"; // to replace with our schema uid

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165", // to replace with our contract
      expirationTime: 0,
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();
  console.log("New attestation UID:", newAttestationUID);
}
