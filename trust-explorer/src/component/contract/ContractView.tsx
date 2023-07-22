import { Container } from "@chakra-ui/react";

interface Props {
  address: string;
}

export default function ContractView(props: Props) {
  const { address } = props;
  return <Container maxW={"6xl"}>{address}</Container>;
}
