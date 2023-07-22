import { BigDecimal, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  Attested as AttestedEvent,
  Contract as EAS,
} from "../generated/Contract/Contract";
import { Attestation } from "../generated/schema";
import { getContractOrCreate } from "./getters";

export function handleAttested(event: AttestedEvent): void {
  if (
    event.params.schema.equals(
      Bytes.fromHexString(
        "0xfd1d09737b6a97b7feae8d388f71e17b8dec6cb19d10ab6fef6bc337859cdb2b"
      )
    )
  ) {
    let entity = new Attestation(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    );
    entity.recipient = event.params.recipient.toHexString();
    entity.attester = event.params.attester;
    entity.uid = event.params.uid;

    entity.schema = event.params.schema;

    entity.blockTimestamp = event.block.timestamp;
    entity.transactionHash = event.transaction.hash;

    const easContract = EAS.bind(event.address);
    const attestation = easContract.getAttestation(event.params.uid);

    const recipient = attestation.recipient;
    const decoded = ethereum
      .decode("(uint8,uint256,uint256,uint256[8])", attestation.data)!
      .toTuple();
    const score = decoded[0].toI32();
    entity.score = score;
    entity.save();

    let contract = getContractOrCreate(recipient);
    const count = contract.attestationsCount + 1;
    const sum = contract.scoreSum + score;
    contract.attestationsCount = count;
    contract.scoreSum = sum;
    contract.scoreAvg = BigDecimal.fromString(sum.toString()).div(
      BigDecimal.fromString(count.toString())
    );
    contract.save();
  }
}
