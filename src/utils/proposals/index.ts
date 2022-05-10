export const sendFunds = (amount: number, recipientAddress: string) => `
  (impl-trait 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.proposal-trait.proposal-trait)

  (define-constant ERR_NOT_ENOUGH_FUNDS (err u2000))

  (define-constant VAULT 'SP143YHR805B8S834BWJTMZVFR1WP5FFC03WZE4BF.sde009-safe)
  (define-constant AMOUNT u${amount})
  (define-constant RECIPIENT_ADDRESS '${recipientAddress})

  (define-public (execute (sender principal))
    (let
      (
        (currentBalance (stx-get-balance VAULT))
      )
      (asserts! (> currentBalance AMOUNT) ERR_NOT_ENOUGH_FUNDS)
      (contract-call? VAULT send-stx amount RECIPIENT_ADDRESS)
    )
  )     
`;