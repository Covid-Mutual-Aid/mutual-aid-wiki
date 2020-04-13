import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { Proof, ProofType, isProved } from 'ts-prove'
import { of, Observable, throwError } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'

type Input = { event: APIGatewayProxyEvent; context: Context }

// Lambda Observable wrapper
const lambda = (req$: (x: Observable<Input>) => Observable<APIGatewayProxyResult>) => (
  event: APIGatewayProxyEvent,
  context: Context
) => req$(of({ event, context })).toPromise()

// Body attribute selector
lambda.body = mergeMap((x: Input) =>
  x.event.body
    ? of(JSON.parse(x.event.body) as Record<string, unknown>)
    : throwError('Missing body')
)

// QueryStringParameters attribute selector
lambda.params = mergeMap((x: Input) =>
  x.event.queryStringParameters
    ? of(x.event.queryStringParameters)
    : throwError('Missing queryStringParameters')
)

lambda.paramsAndBody = mergeMap((x: Input) =>
  lambda
    .body(of(x))
    .pipe(mergeMap((body) => lambda.params(of(x)).pipe(map((params) => ({ params, body })))))
)

lambda.prove = <P extends Proof<any>>(proof: P) =>
  mergeMap<unknown, Observable<ProofType<P>>>((x) => {
    const result = proof(x)
    return isProved(result) ? of(result[1] as ProofType<P>) : throwError(result[0])
  })

const l = lambda
export default l
