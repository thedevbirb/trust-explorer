import { ethers } from "ethers";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

const EAS_CONTRACT_ADDRESS = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84";
const eas = new EAS(EAS_CONTRACT_ADDRESS);

export function generateSignal(
  attester: string,
  contractAddress: string | null | undefined,
  score: number
) {
  if (!contractAddress) return;
  const signal = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address", "address", "uint8"],
    [attester, contractAddress, score]
  );

  console.log("signal", signal);

  return signal;
}

export async function generateAttestation(
  root: string,
  proof: string,
  nullifierHash: string,
  score: number,
  contract: string
) {
  const provider = new ethers.BrowserProvider(window.ethereum); //web3Provider(window.ethereum);
  const signer = await provider.getSigner();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(
    "uint8 score,uint256 root,uint256 nullifierHash,bytes memory proof"
  );

  const encodedData = schemaEncoder.encodeData([
    { name: "score", value: score, type: "uint8" },
    { name: "root", value: root, type: "uint256" },
    { name: "nullifierHash", value: nullifierHash, type: "uint256" },
    { name: "proof", value: proof, type: "bytes" },
  ]);

  const schemaUID =
    "0x983d44f93dfaac4764f1189f3bc04a4cd5e134e1f79b7dd185af10c9c5db3871";

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: contract,
      expirationTime: 0,
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();
  console.log("New attestation UID:", newAttestationUID);
}
