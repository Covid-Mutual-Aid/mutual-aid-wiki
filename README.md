# Mutual Aid Wiki: a unified source of information on mutual aid groups throughout the world

![Image of several panes displaying the user interface of the map](preview.png?raw=true 'Preview Image')

This resource combines community maintained sources with individual submissions to provide a unified source of information on mutual aid groups.

It hopes to enable individuals to connect with their mutual aid communities and to enable mutual aid communities find each other, share approaches and support one another.

This project started with [covidmutualaid.org](http://covidmutualaid.org/) but has been opened up to efforts outside the UK when mutual aid groups in other countries began appearing on the map. Now it aims to support other mutual aid initiatives by providing this data either through an embeddable map or as a public API for other mapping initiatives.

## Background

This project began as a map that synced with a google sheet of mutual aid groups in the UK. It now enables:

- Groups to add and edit their information
- Groups to draw polygons to indicate the area they encompass
- Individuals to verify their email with a group in order to edit it
- Syncing with other sources of mutual aid groups data through the code in external-data

It is deployed with serverless on AWS using dynamoDB. Typescript is used throughout with React.js on the client and RxJS on the lambdas.

## Use our data

Our data is available as the embeddable map, or as an endpoint that can be queried directly from your client: https://mutualaid.wiki/api/group/get

## Participate

We are looking for developers to integrate community maintained lists of groups and maintain and improve this resource. We are also looking for volunteers to help us with outreach and community support.

Get in touch here: info@mutualaid.wiki
Join our community slack channel: XXXXX
Have a look at our issues here: XXXX
Our project management board here: XXXX

# Getting started

Clone the repository

- fill out env.json
- Run `yarn install`
- Run `yarn start`

## Structure

A Lambda function scrapes the existing google docs spreadsheet for all the groups, geocodes these groups from the provided location string and populates a serverless instance of DynoDB with the entries (removing duplicates). Several more Lambda functions sit in front of this to provide a minimal REST API for the client

The client pulls the (large) array of all the geocoded groups and renders it into an interactive map, enabling users to sort by distance against a provided address. A separate UI is also provided that enables users to add groups.

## Built with

- Serverless
- Typescript
- React
- Google Maps API

Check the `package.json` file for commands to run the client and server separately
