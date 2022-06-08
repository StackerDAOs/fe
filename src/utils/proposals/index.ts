export const sendFunds = (contractAddress: string, description: string, amount: string, recipientAddress: string, proposer: string | undefined = 'StackerDAOs') => `                                                        
  ;; Title: SDP Transfer Stacks
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Transfer

  (impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? '${contractAddress}.sde-vault transfer u${amount} '${recipientAddress}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )    
`;