import { Button, ButtonProps, Spinner } from '@chakra-ui/react';

// Stacks
import { useContractDeploy } from '@micro-stacks/react';

type ContractDeployType = {
  title?: string;
  codeBody: string;
  contractName: string;
  onFinish?: (data: any) => void;
};

export const ContractDeployButton = (
  props: ButtonProps & ContractDeployType,
) => {
  const { title, contractName, codeBody, onFinish } = props;

  const { handleContractDeploy, isLoading } = useContractDeploy({
    codeBody,
    contractName,
    onFinish,
  });

  return (
    <Button
      {...props}
      disabled
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      onClick={() => handleContractDeploy()}
    >
      {isLoading ? <Spinner /> : title || 'Deploy'}
    </Button>
  );
};
