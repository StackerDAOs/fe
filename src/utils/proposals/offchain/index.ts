import { traitPrincipal } from "@common/constants";

export const offChain = (description: string, proposer: string | undefined = 'StackerDAOs') => `
  ;; Title: SDP Offchain Proposal
  ;; Author: ${proposer}
  ;; Description: ${description}
  ;; Type: Survey

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (print {event: "execute", sender: sender})
      (ok true)
    )
  )
`;