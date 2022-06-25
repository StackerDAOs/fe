import { traitPrincipal } from "@common/constants";

export const sendFunds = (contractAddress: string, description: string, amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `
  ;; Title: SDP Transfer Stacks
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Transfer

  (define-constant MICRO (pow u10 u6))

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? '${contractAddress}.sde-vault transfer (* MICRO u${amount}) '${recipientAddress}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )
`;

export const sendTokens = (contractAddress: string, tokenContract: string, description: string, decimals: string = '6', amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `
  ;; Title: SDP Transfer Tokens
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Transfer

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-constant MICRO (pow u10 u${decimals}))

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? '${contractAddress}.sde-vault transfer-ft '${tokenContract} (* MICRO u${amount}) '${recipientAddress}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )
`;