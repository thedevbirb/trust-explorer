import fetch from "cross-fetch";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

// This is the Apollo graphQL client config object
const Client = () =>
  new ApolloClient({
    link: new HttpLink({
      uri: "https://api.thegraph.com/subgraphs/name/albygiaco/eth-paris",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
type AttestedsQueryResult = {
  attestationsCount: number;
  scoreAvg: string;
};

export const useGraph = () => {
  const queryAttestation = async (
    contract: string
  ): Promise<AttestedsQueryResult[]> => {
    if (!contract) return [];
    const query = gql`
      {
        contracts(where: {id: "${contract.toLowerCase()}"}) { 
          attestationsCount
          scoreAvg
        }
      }
    `;
    const response = (await Client().query({
      query,
    })) as any;

    return response.data.contracts;
  };

  return {
    queryAttestation,
  };
};
