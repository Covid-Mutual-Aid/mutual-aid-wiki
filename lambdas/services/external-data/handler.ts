import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import { throwError } from 'rxjs'
import P from 'ts-prove'

import lambda, { params, responseJson$ } from '../_utility_/lib/lambdaRx'
import { getData } from './sources/usa-localised-resources'
import { testSource } from './sources/test-sheet'
import { mutualaidwikiSheet } from './sources/mutualaidwiki-sheet'
import { esLocalisedResources } from './sources/es-localised-resources'

export const getExternalData = lambda((req$) => req$.pipe(switchMap(getData), responseJson$))

export const getTestData = lambda((req$) => req$.pipe(switchMap(testSource.handler), responseJson$))

export const covid19MutualAidGroupsUkHandler = lambda((req$) =>
  req$.pipe(switchMap(mutualaidwikiSheet.handler), responseJson$)
)

const sources = [testSource, mutualaidwikiSheet, esLocalisedResources]

export const triggerSource = lambda((req$) =>
  req$.pipe(
    params(P.shape({ id: P.string })),
    switchMap(({ id }) => {
      const source = sources.find((s) => s.external_id === id)
      if (typeof source === 'undefined') return throwError('Not valid id')
      return source.handler()
    }),
    responseJson$
  )
)
