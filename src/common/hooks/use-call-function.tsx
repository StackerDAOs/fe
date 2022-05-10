import { useEffect, useState } from "react";
import { fetchReadOnlyFunction } from "micro-stacks/api";
import { StacksMocknet } from "micro-stacks/network";

interface TransactionProps {
  contractAddress: string;
  contractName: string;
  functionArgs?: string[] | any;
  senderAddress: any;
  functionName: string;
  tip?: number;
  shouldPoll?: boolean;
}

export const useCallFunction = (
  {
    contractAddress,
    contractName,
    functionArgs = [],
    senderAddress,
    functionName,
  }: TransactionProps) => {
  const [status, setStatus] = useState("pending");
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);
  const network = new StacksMocknet();

  useEffect(() => {
    async function fetch() {
      try {
        const data: any = await fetchReadOnlyFunction({
          network,
          contractAddress,
          contractName,
          senderAddress,
          functionArgs,
          functionName,
        });
        setValue(data);
        setStatus("success");
      } catch (e: any) {
        setError(e)
      }
    }

    fetch();
    
  }, [contractName]);

  return { value, status, setValue, error };
};