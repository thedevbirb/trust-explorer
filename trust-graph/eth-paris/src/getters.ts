import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import { Contract } from "../generated/schema";

export function getContractOrCreate(address: Address): Contract {
  let contract = Contract.load(address.toHexString());

  if (contract == null) {
    contract = new Contract(address.toHexString());
    contract.attestationsCount = 0;
    contract.scoreSum = 0;
    contract.scoreAvg = BigDecimal.fromString("0");
  }

  return contract as Contract;
}
