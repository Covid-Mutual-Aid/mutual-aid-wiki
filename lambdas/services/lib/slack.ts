// import { WebClient } from '@slack/web-api'

// let slack = new Slack()
// slack.setWebhook(process.env.SLACK_WEB_HOOK)

// const slackMessage = (text, attachments) =>
//   new Promise((resolve, reject) => {
//     slack.webhook(
//       {
//         channel: process.env.STAGE === 'dev' ? '#london-talks-dev' : '#london-talks',
//         username: 'webhookbot',
//         mrkdwn: true,
//         text,
//         attachments,
//       },
//       function (err, response) {
//         if (err) return reject(err)
//         return resolve(response)
//       }
//     )
//   })

// export default slackMessage
