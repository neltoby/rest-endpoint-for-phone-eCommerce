## Description

This is a rest api service that pulls data from a google sheet into mongodb a datastore to further serve request. To speed data pulling from google sheets, pulled data are cached for a maximum of one hour with Redis. Actually data refresh actually takes place after every request made 1hour after the previous one.
This api was built using Nodejs, Typescript, Express, MongoDb, Redis


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run serve

# production mode
$ npm start
```

## Principle and decisions

In building this api service, some decisions and principle and architectural design were at play -

## `Architectural design pattern`

The architectural design pattern used here is the clean architectural design pattern. This make is easy to enforce decoupling to a bearest minimum. its 100 framework agnostic, Database agnostic. Say i decide to change the framework used ie Express to Hapi or Koa, the other part of my codes are safe and wouldn't break. Also the singleton design pattern played a key role in designing this service.