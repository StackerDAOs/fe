import type { ButtonProps, IconProps, IconButtonProps } from '@chakra-ui/react';

export interface BootstrapProps extends ButtonProps {
  title: string;
  address: string;
}

export interface DeployProposalProps extends ButtonProps {
  organization?: any;
  title: string;
  description: string;
}

export interface ExecuteProposalProps extends ButtonProps {
  proposalPrincipal: string;
  postConditions?: any;
  assetName?: string;
}

export interface VoteProposalProps extends ButtonProps {
  text: string;
  proposalPrincipal: string;
  voteFor: boolean;
}

export interface DepositProps extends ButtonProps {
  title: string;
  amount: string;
}

export interface ProposeProps extends ButtonProps {
  text: string;
  proposalPrincipal: string;
  notDeployer: boolean;
}

export type { ButtonProps, IconProps, IconButtonProps };
