import lambda, { responseJson$ } from '../_utility_/lib/lambdaRx'
import { switchMap } from 'rxjs/operators'
import axios from 'axios'

const getIp = (headers: any) => {
  const value = headers['X-Forwarded-For'] || headers['x-forwarded-for']
  return value.split(',')[0]
}

export const locate = lambda((req) =>
  req.pipe(
    switchMap((input) => {
      console.log(input._event.headers['x-forwarded-for'])
      return axios
        .get(`http://ip-api.com/json/${getIp(input._event.headers)}`)
        .then((x) =>
          x.data.status === 'fail'
            ? Promise.reject(`Failed to locate ip ${getIp(input._event.headers)}`)
            : x.data
        )
    }),
    responseJson$
  )
)
