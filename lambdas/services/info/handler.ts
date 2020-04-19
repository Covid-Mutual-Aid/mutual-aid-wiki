import lambda, { responseJson$ } from '../_utility_/lib/lambdaRx'
import { switchMap } from 'rxjs/operators'
import axios from 'axios'

export const locate = lambda((req) =>
  req.pipe(
    switchMap((input) =>
      axios
        .get(`http://ip-api.com/json/${input._event.headers['X-Forwarded-For'].split(',')[0]}`)
        .then((x) =>
          x.data.status === 'fail'
            ? Promise.reject(
                `Failed to locate ip ${input._event.headers['X-Forwarded-For'].split(',')[0]}`
              )
            : x.data
        )
    ),
    responseJson$
  )
)
