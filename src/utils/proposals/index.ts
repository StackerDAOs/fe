export const sendFunds = (description: string, amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `                                                        
  ;; Title: SDP Transfer Stacks
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Transfer

  (impl-trait .proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? .sde-vault transfer u${amount} '${recipientAddress}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )    
`;