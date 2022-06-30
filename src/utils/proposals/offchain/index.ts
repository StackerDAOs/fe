import { traitPrincipal } from "@common/constants";

export const socialProposal = (title: string, description: string, proposer: string | undefined = 'StackerDAOs') => `
;; Type: Social
;; Author: ${proposer}
;; Title: ${title}
;; Description: ${description}

  (impl-trait '${traitPrincipal}.proposal-trait.proposal-trait)

  (define-public (execute (sender principal))
    (begin
      (print {event: "execute", sender: sender})
      (ok true)
    )
  )
`;