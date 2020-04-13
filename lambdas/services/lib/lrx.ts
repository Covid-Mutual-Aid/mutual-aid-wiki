import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import { of, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { failedRequest } from './external/slack'
import { isOffline } from './environment'

export type LRXReq = { event: APIGatewayProxyEvent; context: Context }

// Lambda Observable wrapper
const lambda = (req$: (x: Observable<LRXReq>) => Observable<APIGatewayProxyResult>) => (
  event: APIGatewayProxyEvent,
  context: Context
) =>
  req$(of({ event, context }))
    .toPromise()
    .catch((err) =>
      Promise.resolve(
        isOffline() || process.env.TESTING
          ? err.message || err
          : failedRequest({
              method: event.httpMethod,
              path: event.path,
              params: event.queryStringParameters,
              body: event.body,
              resource: event.resource,
            }).then(() => err.message || err)
      ).then((error) => ({ statusCode: 500, body: JSON.stringify({ error }) }))
    )

// Body attribute selector
export const body$ = map(
  (x: LRXReq) => JSON.parse(x.event.body as string) as Record<string, unknown>
)

// QueryStringParameters attribute selector
export const params$ = map((x: LRXReq) => x.event.queryStringParameters as Record<string, unknown>)

export const response$ = map((groups) => ({
  statusCode: 200,
  headers: { 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify(groups),
}))

const lrx = lambda

export default lrx
