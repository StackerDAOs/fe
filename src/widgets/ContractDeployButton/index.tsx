import { Button, ButtonProps, Spinner } from '@chakra-ui/react';

// Stacks
import { useOpenContractDeploy } from '@micro-stacks/react';

type ContractDeployType = {
  title?: string;
  codeBody: string;
  contractName: string;
  onFinish?: (data: any) => void;
};

export const ContractDeployButton = (
  props: ButtonProps & ContractDeployType,
) => {
  const { openContractDeploy, isRequestPending } = useOpenContractDeploy();
  const { title, contractName, codeBody, onFinish } = props;

  const handleContractDeploy = async () => {
    await openContractDeploy({
      contractName,
      codeBody,
      onFinish,
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  return (
    <Button
      {...props}
      disabled
      _hover={{ opacity: 0.9 }}
      _active={{ opacity: 1 }}
      onClick={() => handleContractDeploy()}
    >
      {isRequestPending ? <Spinner /> : title || 'Deploy'}
    </Button>
  );
};
