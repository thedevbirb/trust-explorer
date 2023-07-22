import Homepage from "../component/Homepage";
import MainSection from "../component/MainSection";
import Hero from "../component/Hero";
import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { useMemo } from "react";
import ContractView from "../component/contract/ContractView";

const ID: NextPage = () => {
  const params = useRouter().query;

  const contractId = useMemo(() => params.id as string, [params.id]);

  return <ContractView contractAddress={contractId} />;
};

export default ID;
