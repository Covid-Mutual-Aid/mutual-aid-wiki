import P, { Proof, ProofType, isProved } from 'ts-prove'
import { Observable, of, throwError } from 'rxjs'
import { mergeMap } from 'rxjs/operators'

export const prove$ = <P extends Proof<any>>(proof: P) =>
  mergeMap<unknown, Observable<ProofType<P>>>((x) => {
    const result = proof(x)
    return isProved(result) ? of(result[1] as ProofType<P>) : throwError(result[0])
  })

export const proofs = {
  groupCreation: P.shape({
    name: P.string,
    emails: P.array(P.string),
    link_facebook: P.string,
    links: P.array(
      P.shape({
        url: P.string,
      })
    ),
    location_name: P.string,
    location_country: P.string,
    location_coord: P.shape({
      lat: P.number,
      lng: P.number,
    }),
  }),
}
