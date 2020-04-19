import lambda, { responseJson$ } from '../_utility_/lib/lambdaRx'
import { switchMap } from 'rxjs/operators'
import axios from 'axios'

export const locate = lambda((req) =>
  req.pipe(
    switchMap((input) =>
      axios.get(`https://ip-api.com/json/${input._event.requestContext.identity.sourceIp}`)
    ),
    responseJson$
  )
)
