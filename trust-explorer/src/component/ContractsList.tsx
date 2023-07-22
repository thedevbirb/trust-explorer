import ContractCard from "./ContractCard";
import { contracts } from "./data/data";

export type Contract = {
  address: string;
  name: string;
  good: number;
  bad: number;
  link: string;
};

export default function ContractsList() {
  return (
    <div>
      {contracts.map((contract) => {
        return <ContractCard contract={contract} />;
      })}
    </div>
  );
}
