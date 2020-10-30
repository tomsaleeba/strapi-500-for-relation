A minimal reproduction of a bug where sending an invalid relation ID while using
postgrest results in a 500 response, where I think it should be a 4xx response
because it's a client error. This happens on postgres but doesn't seem to happen
with sqlite.

# How to run
  1. clone repo
  1. have docker installed
  1. install dependencies:
      ```bash
      yarn install
      ```
  1. run the test
      ```bash
      ./start-pg-and-strapi.sh
      # this script isn't bulletproof so if you have timing issues, just run the
      # commands separately.
      ```
  1. You can `control+c` to kill strapi and the docker container. You can ignore
     the webpage that is launched to create an admin user.

Expected: I think the server should respond with a 400 response because the
client has passed invalid data.

Actual: the server has an internal error and responds with a 500. The stacktrace
looks like:
```
error error: invalid input syntax for type integer: "99a"
    at Parser.parseErrorMessage (/strapi-500-for-relation/node_modules/pg-protocol/dist/parser.js:278:15)
    at Parser.handlePacket (/strapi-500-for-relation/node_modules/pg-protocol/dist/parser.js:126:29)
    at Parser.parse (/strapi-500-for-relation/node_modules/pg-protocol/dist/parser.js:39:38)
    at Socket.<anonymous> (/strapi-500-for-relation/node_modules/pg-protocol/dist/index.js:10:42)
    at Socket.emit (events.js:315:20)
    at addChunk (_stream_readable.js:295:12)
    at readableAddChunk (_stream_readable.js:271:9)
    at Socket.Readable.push (_stream_readable.js:212:10)
    at TCP.onStreamRead (internal/stream_base_commons.js:186:23)
From previous event:
    at Client_PG._query (/strapi-500-for-relation/node_modules/knex/lib/dialects/postgres/index.js:234:12)
    at Client_PG.query (/strapi-500-for-relation/node_modules/knex/lib/client.js:158:17)
    at /strapi-500-for-relation/node_modules/knex/lib/transaction.js:331:24
From previous event:
    at Client_PG.trxClient.query (/strapi-500-for-relation/node_modules/knex/lib/transaction.js:326:12)
    at Runner.query (/strapi-500-for-relation/node_modules/knex/lib/runner.js:135:36)
    at /strapi-500-for-relation/node_modules/knex/lib/runner.js:39:23
From previous event:
    at Runner.run (/strapi-500-for-relation/node_modules/knex/lib/runner.js:25:16)
    at Builder.Target.then (/strapi-500-for-relation/node_modules/knex/lib/interface.js:14:43)
    at Child.<anonymous> (/strapi-500-for-relation/node_modules/bookshelf/lib/model.js:1160:42)
From previous event:
    at Child.<anonymous> (/strapi-500-for-relation/node_modules/bookshelf/lib/model.js:1159:14)
    at processImmediate (internal/timers.js:456:21)
From previous event:
    at Child.<anonymous> (/strapi-500-for-relation/node_modules/bookshelf/lib/model.js:1060:10)
From previous event:
    at Function.update [as updateRelations] (/strapi-500-for-relation/node_modules/strapi-connector-bookshelf/lib/relations.js:374:10)
```
