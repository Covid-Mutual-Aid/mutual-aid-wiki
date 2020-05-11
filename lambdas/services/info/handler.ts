import lambda, { responseJson$ } from '../_utility_/lib/lambdaRx'
import { switchMap, map } from 'rxjs/operators'
import axios from 'axios'

export const locate = lambda((req) =>
  req.pipe(
    switchMap((input) => {
      const forward =
        input._event.headers['X-Forwarded-For'] || input._event.headers['x-forwarded-for']
      const ip = forward ? forward.split(',')[0] : null
      if (!ip) return Promise.reject('Bad IP')
      return axios
        .get(`http://ip-api.com/json/${getIp(input._event)}`)
        .then((x) =>
          x.data.status === 'fail'
            ? Promise.reject(`Failed to locate ip ${getIp(input._event)}`)
            : x.data
        )
    }),
    responseJson$
  )
)

const getIp = (event: any) => {
  const value =
    event.headers['X-Forwarded-For'] ||
    event.headers['x-forwarded-for'] ||
    event.requestContext.identity.sourceIp
  return value.split(',')[0]
}

export const ping = lambda((req) =>
  req.pipe(
    map(() => 'pong'),
    responseJson$
  )
)
