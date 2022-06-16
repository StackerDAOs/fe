import { traitPrincipal } from "@common/constants";

export const sendFunds = (contractAddress: string, description: string, amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `
  ;; Title: SDP Transfer Stacks
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Transfer

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? '${contractAddress}.sde-vault transfer u${amount} '${recipientAddress}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )    
`;

export const sendTokens = (contractAddress: string, tokenContract: string, description: string, amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `
  ;; Title: SDP Transfer Fungible Tokens
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Transfer

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? '${contractAddress}.sde-vault transfer-ft '${tokenContract} u${amount} '${recipientAddress}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )    
`;