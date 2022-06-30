import { traitPrincipal } from "@common/constants";

export const sendFunds = (title: string, contractAddress: string, description: string, amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `
;; Type: Transfer STX  
;; Author: ${proposer}
;; Title: ${title}
;; Description: ${description}

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

export const sendTokens = (title: string, contractAddress: string, tokenContract: string, description: string, decimals: string = '6', amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `
;; Type: Transfer Tokens  
;; Author: ${proposer}
;; Title: ${title}
;; Description: ${description}

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