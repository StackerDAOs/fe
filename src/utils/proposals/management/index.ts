import { traitPrincipal } from 'lib/constants';

export const whitelistAsset = (
  contractAddress: string,
  description: string,
  tokenContract: string,
  enabled = 'true',
  proposer: string | undefined = 'StackerDAOs',
) => `
  ;; Title: SDP Whitelist Asset
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Management

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (try! (contract-call? '${contractAddress}.sde-vault '${tokenContract} ${enabled}))

      (print {event: "execute", sender: sender})
      (ok true)
    )
  )
`;
