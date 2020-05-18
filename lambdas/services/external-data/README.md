# Syncing external data

This resource currently syncs data with a number of external sources and it would be great if it could sync with more. You can see what sources are currently being synced by looking in the `sources` directory and the `functions.yml` file which will show the active sources and when they are being scheduled to pull.

## Terminology

Adapters are utilities to create a source and a source is a lambda function that is responsible for pulling from an external dataset and updating the database. A `createSource` function is provided that accepts a few parameters (test cases, source id, url) and an array of groups and handles deduping, geolocating, diffing with existing groups and updating the database. Several more helper functions exist to make formatting external group data into the shape the database expects a little easier.

## Get Started

Start by following the instructions in the README at the root of the project. Once you have been able to set up your local environment, duplicate an existing source and have a look at the helper functions in `adapters.tsx`. The main two functions that may be useful are `groupConstructor` and `groupConstructorObj`. These functions accept a "mapping" object and map external fields to the ones used by this resource. For example:

```
  const create = groupConstructorObj({
    nameField: 'name',
    linkFieldA: 'links', // `links` is the only field you can reference more then once
    linkFieldB: 'links',
    locationField: 'location_name',
  })

  const formattedGroup = create({
    nameField: 'example mutual aid',
    linkFieldA: 'https://linkfielda.com',
    linkFieldB: 'https://linkfieldb.com',
    locationField: 'Example Location Somewhere',
    shouldGoIntoExternalData: 'foo bar',
  })

  expect(formattedGroup).toEqual({
    name: 'example mutual aid',
    links: [{ url: 'https://linkfielda.com' }, { url: 'https://linkfieldb.com' }],
    location_name: 'Example Location Somewhere',
    external_data: {
      shouldGoIntoExternalData: 'foo bar',
    },
  }) // Pass

  // You can now use create() like so:
  const formattedGroups = await axios.get('https://acommunityanagedresource.org/api/get').then(groups => groups.map(create))

```

The `groupConstructor` constructor works similarly to `groupConstructorObj`, but with an array of groups as an array and a label array which is used to determine which index of the incoming array relates to which field (useful for pulling from google sheets). The above example also shows how fields existing in the incoming data but not present in the map object are automatically added to the external_data field.

When creating a source, you must provide an array of test cases; groups that you expect to exist in this resource. The source will run so long as one of these groups are found. This is to prevent malformed data being entered into the database if the shape of the incoming data changes unexpectedly (e.g someone moved the columns in the google sheet by mistake). Around 7-10 test cases are encouraged for redundancy.

## Sync protocol

This resource aims to avoid mutliple sources of truth on a single group. This is done by treating each source as the canonical source of information on the groups it provides unless this group is claimed directly on mutualaid.wiki.

This is how the sync is performed by createSource():

- Pull list of groups from external source
- Dedupe list against itself and groups in the database
- Matche list against groups previously pulled from this source
- Ignore exact matches between existing groups and groups stored
- Remove existing items that have no matches from the database
- Geolocate and add incoming items that have no matches to the database

The code for this is in `helpers.tsx`. When a group is edited directly on mutualaid.wiki (after email authentication), the source of this group is changed to `mutualaidwiki`, at which point it is treated as if it was added directly to the platform and ignored in further syncs.

## Feedback

Please open an issue/PR or send us an email if you spot issues or opportunities for improvements. We would love to hear from you!
