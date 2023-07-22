import { newMockEvent } from "matchstick-as";
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  Attested,
  Revoked,
  RevokedOffchain,
  Timestamped,
} from "../generated/Contract/Contract";

export function createAttestedEvent(
  recipient: Address,
  attester: Address,
  uid: Bytes,
  schema: Bytes
): Attested {
  let attestedEvent = changetype<Attested>(newMockEvent());

  attestedEvent.parameters = new Array();

  attestedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  );
  attestedEvent.parameters.push(
    new ethereum.EventParam("attester", ethereum.Value.fromAddress(attester))
  );
  attestedEvent.parameters.push(
    new ethereum.EventParam("uid", ethereum.Value.fromFixedBytes(uid))
  );
  attestedEvent.parameters.push(
    new ethereum.EventParam("schema", ethereum.Value.fromFixedBytes(schema))
  );

  return attestedEvent;
}
