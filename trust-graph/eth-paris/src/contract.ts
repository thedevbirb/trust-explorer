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
        "0xb32dc5bea1673f9adede5b96abdcf0f79354c9e3bbb4f8b1e678b07138d2ec02"
      )
    )
  )
    entity.save();
}
