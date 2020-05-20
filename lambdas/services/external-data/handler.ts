import 'source-map-support/register'
import { switchMap } from 'rxjs/operators'
import { throwError } from 'rxjs'
import P from 'ts-prove'

import lambda, { params, responseJson$ } from '../_utility_/lib/lambdaRx'
import { getData } from './sources/usa-localised-resources'
import { testSource } from './sources/test-sheet'
import { mutualaidwikiSheet } from './sources/mutualaidwiki-sheet'
import { esLocalisedResources } from './sources/es-localised-resources'
import { reach4help } from './sources/reach4help'
import { austrailiaInformalMutualAid } from './sources/austrailiaInformalMutualAid'
import { usCrowdsourcedMAResources } from './sources/us-crowdsourced-ma-resources-list'

export const getExternalData = lambda((req$) => req$.pipe(switchMap(getData), responseJson$))
export const getTestData = lambda((req$) => req$.pipe(switchMap(testSource.handler), responseJson$))
export const getReach4Help = lambda((req$) =>
  req$.pipe(switchMap(reach4help.handler), responseJson$)
)

export const covid19MutualAidGroupsUkHandler = lambda((req$) =>
  req$.pipe(switchMap(mutualaidwikiSheet.handler), responseJson$)
)

export const austrailiaInformalMutualAidHandler = lambda((req$) =>
  req$.pipe(switchMap(austrailiaInformalMutualAid.handler), responseJson$)
)

export const esLocalisedResourcesHandler = lambda((req$) =>
  req$.pipe(switchMap(esLocalisedResources.handler), responseJson$)
)

export const usCrowdsourcedMAResourcesHander = lambda((req$) =>
  req$.pipe(switchMap(usCrowdsourcedMAResources.handler), responseJson$)
)

const sources = [testSource, mutualaidwikiSheet, esLocalisedResources, austrailiaInformalMutualAid, usCrowdsourcedMAResources]

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
