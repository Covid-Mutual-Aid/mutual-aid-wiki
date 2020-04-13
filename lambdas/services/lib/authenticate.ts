import { mergeMap } from 'rxjs/operators'
import { LRXReq } from './lrx'
import { of } from 'rxjs'

const isAuthed = (input: LRXReq) => of(input).pipe()
