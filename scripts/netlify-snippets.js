const axios = require('axios')

const stack = require('../stack.json')

const updateSnippet = (access_token, site_id, snippet_id, endpoint) =>
  axios
    .put(
      `https://api.netlify.com/api/v1/sites/${site_id}/snippets/${snippet_id}?access_token=${access_token}`,
      {
        title: 'Inject endpoint',
        general: `<script>setTimeout(() => window.endpoint = "${endpoint}", 0)</script>`,
        general_position: 'head',
        goal_position: 'head',
      }
    )
    .catch((err) => {
      console.log('FAILED TO PUT', err)
      return axios.post(
        `https://api.netlify.com/api/v1/sites/${site_id}/snippets?access_token=${access_token}`,
        {
          title: 'Inject endpoint',
          general: `<script>setTimeout(() => window.endpoint = "${endpoint}", 0)</script>`,
          general_position: 'head',
          goal_position: 'head',
        }
      )
    })

updateSnippet(
  process.env.NETLIFY_ACCESS_TOKEN,
  process.env.NETLIFY_SITE_ID,
  0,
  stack.ServiceEndpoint
)
