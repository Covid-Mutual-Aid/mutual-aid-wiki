import { WebClient, ChatPostMessageArguments } from '@slack/web-api'
import { SLACK_API_TOKEN } from './utils'
import { Group } from './types'

const slackClient = new WebClient(SLACK_API_TOKEN)

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
    {
      type: 'section',
      fields: (Object.keys(data) as (keyof Group)[]).map((key) => ({
        type: 'plain_text',
        text: `${key}: ${data[key]}`,
      })),
    },
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
    {
      type: 'divider',
    },
    {
      type: 'section',
      fields: (Object.keys(group) as (keyof Group)[]).map((key) => ({
        type: 'plain_text',
        text: `${key}: ${group[key]}`,
      })),
    },
  ])
