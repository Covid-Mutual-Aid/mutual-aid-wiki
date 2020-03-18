import dynamoClient from './dynamodb'

export const getGroups = () =>
  dynamoClient
    .scan({ TableName: process.env.DYNAMODB_TABLE as string })
    .promise()
    .catch(err => err.message)
    .then(x => x.Items)
