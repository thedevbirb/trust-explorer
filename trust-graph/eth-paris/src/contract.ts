import { Bytes } from "@graphprotocol/graph-ts";
import { Attested as AttestedEvent } from "../generated/Contract/Contract";
import { Attested } from "../generated/schema";

export function handleAttested(event: AttestedEvent): void {
  let entity = new Attested(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.recipient = event.params.recipient;
  entity.attester = event.params.attester;
  entity.uid = event.params.uid;

  entity.schema = event.params.schema;

  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  if (
    event.params.schema.equals(
      Bytes.fromHexString(
        "0xf58b8b212ef75ee8cd7e8d803c37c03e0519890502d5e99ee2412aae1456cafe"
      )
    )
  )
    entity.save();
}
