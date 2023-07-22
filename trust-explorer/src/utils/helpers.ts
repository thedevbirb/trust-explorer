import { AbiCoder, ethers } from "ethers";
import {
  EAS,
  SchemaEncoder,
  ZERO_BYTES32,
} from "@ethereum-attestation-service/eas-sdk";
import easabi from "../../public/abis/ensabi.json";
import { solidityEncode } from "@worldcoin/idkit";

const EAS_CONTRACT_ADDRESS = "0x1a5650D0EcbCa349DD84bAFa85790E3e6955eb84";
const eas = new EAS(EAS_CONTRACT_ADDRESS);

export function generateSignal(
  attester: string,
  contractAddress: string | null | undefined,
  score: number
) {
  if (!contractAddress) return;
  const signal = ethers.solidityPacked(
    ["address", "address", "uint8"],
    [attester, contractAddress, score]
  );

  return signal;
}

export async function generateAttestation(
  root: string,
  proof: string,
  nullifierHash: string,
  score: number,
  contract: string
) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  console.log("signer", signer);
  eas.connect(signer as any);

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

  console.log("encodedData", encodedData);

  const schemaUID =
    "0x983d44f93dfaac4764f1189f3bc04a4cd5e134e1f79b7dd185af10c9c5db3871";

  try {
    const tx = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [
        {
          from: await signer.getAddress(),
          to: EAS_CONTRACT_ADDRESS,
          data:
            "0xf17325e70000000000000000000000000000000000000000000000000000000000000020" +
            ethers.AbiCoder.defaultAbiCoder()
              .encode(
                ["uint256", "address", "uint256", "bool", "bytes", "uint256"],
                [schemaUID, contract, 0, true, encodedData, 0]
              )
              .split("0x")[1],
          gasLimit: "0x186a0",
          gasPrice: "0x4a817c800",
          value: 0,
        },
      ],
    });

    // const easContract = new ethers.Contract(
    //   EAS_CONTRACT_ADDRESS,
    //   easabi,
    //   signer
    // );
    // try {
    //   const realtx = await easContract.attest(
    //     schemaUID,
    //     [contract, 0, true, ZERO_BYTES32, encodedData, 0],
    //     {
    //       gasLimit: 1000000,
    //     }
    //   );
    //   const tx = await eas.attest({
    //     schema: schemaUID,
    //     data: {
    //       recipient: contract,
    //       expirationTime: 0,
    //       revocable: true,
    //       data: encodedData,
    //       refUID: ZERO_BYTES32,
    //     },
    //   });
    //   const newAttestationUID = await realtx.wait();
    //   console.log("New attestation UID:", newAttestationUID);
    // } catch (e) {
    //   console.log("error", e);
    // }
  } catch (e) {
    console.log("error", e);
  }
}
