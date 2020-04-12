import { WebClient, ChatPostMessageArguments } from '@slack/web-api'
import env from '../lib/environment'
import { Group } from './types'

const slackClient = new WebClient(env.SLACK_API_TOKEN)

export const messageSlack = (text: string, blocks: ChatPostMessageArguments['blocks'] = []) =>
  slackClient.chat.postMessage({
    channel: '#lambdas-covidmutualaid',
    text,
    blocks,
  })

export const failedRequest = (data: Record<string, any>) =>
  messageSlack('Failed request', [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Failed request',
      },
    },
    {
      type: 'divider',
    },
    createFieldsSection(data),
  ])

export const groupCreated = (group: Partial<Group>) =>
  messageSlack('Group created', [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Group created',
      },
    },
    { type: 'divider' },
    createFieldsSection(group),
  ])

const createFieldsSection = (x: Record<string, any>) => ({
  type: 'section',
  fields: (Object.keys(x) as (keyof Group)[]).map((key) => ({
    type: 'plain_text',
    text: `${key}: ${JSON.stringify(x[key])}`,
  })),
})
