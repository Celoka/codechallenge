# Code challenge (Backend)
 
## Eze coding challenge

- This repository contains the solution for the coding challenge.

#### App Features:
- A user can trigger a script to populate data from googlesheet into the database.
- A user can get the data given query strings passed.

#### Functionality
- The data retrieved can be paginated

#### Technology
- This application was developed purely with JavaScript using, NodeJs and Express, MongoDB.

#### Usage:
1. To Trigger data to be populated: 
   * Endpoint: https://ezecodeingchallenge.herokuapp.com/data
   * Payload: { "loadData": "true" }

2. To retrieved data in the DB:
   * Endpoint: https://ezecodeingchallenge.herokuapp.com/data?collection=sellRequest&page=1&limit=5
   * Query params: 
      - collection: type string (sellRequest or buyRequest)
      - page: type int
      - limit: type int
