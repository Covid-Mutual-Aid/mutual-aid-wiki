import { WebClient, ChatPostMessageArguments } from '@slack/web-api'
import env from '../environment'
import { Group } from '../types'

const slackClient = new WebClient(env.SLACK_API_TOKEN)

const messageSlack = (text: string, blocks: ChatPostMessageArguments['blocks'] = []) =>
  slackClient.chat.postMessage({
    channel: '#lambdas-covidmutualaid',
    text,
    blocks,
  })

export const sendData = (title: string, data: Record<string, any>) =>
  messageSlack(title, [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: title,
      },
    },
    {
      type: 'divider',
    },
    createFields(data),
  ])

export const createFields = (x: Record<string, any>) => ({
  type: 'section',
  fields: (Object.keys(x) as (keyof Group)[]).map((key) => ({
    type: 'plain_text',
    text: `${key}: ${JSON.stringify(x[key])}`,
  })),
})
