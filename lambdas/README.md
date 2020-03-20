# Filter Covid19 Mutual Aid groups by location

![Image of browser screen with a map full of red markers. There is a table underneath that lists volunteer groups](preview.png?raw=true 'Example Image')

This app deploys on AWS and does several things:

## Backend

A Lambda function scrapes the existing google docs spreadsheet for all the groups, geocodes these groups from the provided location string and populates a serverless instance of DynoDB with the entries (removing duplicates). Several more Lambda functions sit in front of this to provide a minimal REST API for the client

## Frontend

The client pulls the (large) array of all the geocoded groups and renders it into an interactive map, enabling users to sort by distance against a provided address. A separate UI is also provided that enables users to add groups.

## Built with

- Serverless
- Typescript
- React
- Google Maps API

## Developing

- Clone the repository
- Run `yarn install`
- Run `yarn start`

Check the `package.json` file for commands to run the client and server separately

## Deploying

- Set up your AWS keys in a serverless profile with these [instructions](https://serverless.com/framework/docs/providers/aws/guide/credentials#using-aws-profiles)
- [Get a google API key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- Create a file called `.env` in `/lambdas` and add this line `GOOGLE_API_KEY=YOURAPIKEYHERE` replacing `YOURAPIKEYHERE` with your API key
- Run `serverless deploy`
