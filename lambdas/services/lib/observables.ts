import { mergeMap } from 'rxjs/operators'
import { ObservableInput } from 'rxjs'

export const switchMergeKey = <A extends { [x: string]: any }, B extends any, K extends string>(
  key: K,
  cb: (x: A) => Promise<B>
) =>
  mergeMap<A, ObservableInput<A & { [Key in K]: B }>>((x) =>
    cb(x).then((y) => ({ ...x, [key]: y }))
  )
