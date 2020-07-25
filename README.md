# network-entity-sagas
An entity saga is a `redux-saga` that is able to fetch, create or update an entity or a group of entities from an api and update the 
redux state to reflect the network operation done. It also provides lifecycle hooks, conditional execution, rollback on cancellation
and rollback on error.

## installation
```
yarn add @rolilink/redux-entity-saga
```
or
```
npm install --save @rolilink/redux-entity-saga
```

## usage
To generate the redux entity saga you will need to require `createEntitySaga`:

```
const createEntitySaga = require('@rolilink/redux-entity-saga');

makeReduxEntitySaga(
  { // api calls functions
    dispatchApiCall, // crud api call to the endpoint it should yield a response.
    rollbackApiCall, // rollback operation in case of error or task cancellation.
  },
  { // action creators
    dispatchActionCreator, // action creator that returns the action that adds, create or updates the state.
    rollbackActionCreator, // action creator that rollbacks the state to the previos state.
  },
  { // http hooks
    createRequest, // a function that yields a request object.
    completeRequest, // a function that changes the request status to complete.
    errorRequest, // a function that changes the request status to errored.
    cancelRequest, // a function that changes the request status to cancelled.
  },
);
```

This will return a generator function that can be used as a redux saga.

### Lifecycle hooks
TODO

### Http hooks
TODO

### Creating a CRUD module with axios and @rolilink/redux-network
TODO
