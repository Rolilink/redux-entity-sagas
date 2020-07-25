import { expectSaga } from 'redux-saga-test-plan';
import { fork, cancel } from 'redux-saga/effects';
import createEntitySaga from '..';

const request = {
  id: '1',
  status: 'in-progress',
  url: '/api/entity/',
  method: 'post',
  startedAt: new Date(1595613147959),
  body: {
    name: 'a',
  },
  meta: {
    entityName: 'entity',
  },
};

const entity = {
  name: 'a',
};

const response = {
  id: '1',
  name: 'a',
};

const dispatchAction = {
  type: '@namespace/entity/DISPATCH',
  payload: {
    id: '1',
    name: 'a',
  },
};

const rollbackAction = {
  type: '@namespace/entity/rollback',
  payload: {
    id: '1',
  },
};

// #TODO: figure out a way to cancel the task on time to test the rollback of an http request

describe('createEntitySaga', () => {
  it('should do an api call when no hooks are provided', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(apiCall, entity, httpOpts)
        .run({ silenceTimeout: true })
    );
  });

  it('should dispatch the action returned by the dispatch actionCreator', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .put(dispatchAction)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute the onStart hook when provided', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const onStart = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        onStart,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(onStart, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should halt the saga process and only execute onFinish hook if shouldApiCall hook is provided and returns false', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const shouldDoApiCall = jest.fn().mockReturnValue(false);
    const beforeApiCall = jest.fn();
    const afterApiCall = jest.fn();
    const beforeDispatchEntityAction = jest.fn();
    const afterDispatchEntityAction = jest.fn();
    const onFinish = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        shouldDoApiCall,
        beforeApiCall,
        afterApiCall,
        beforeDispatchEntityAction,
        afterDispatchEntityAction,
        onFinish,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .not.call(apiCall)
        .not.call(beforeApiCall)
        .not.call(afterApiCall)
        .not.call(dispatchFn)
        .not.call(beforeDispatchEntityAction)
        .not.call(afterDispatchEntityAction)
        .not.call(onFinish)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute the beforeApiCall hook', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const beforeApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        beforeApiCall,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(beforeApiCall, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute afterApiCall hook', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const afterApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        afterApiCall,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(afterApiCall, response, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should call the createRequest http hook before doing the api call', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(createRequest, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should call the completeRequest http hook after completing the api call', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(completeRequest, request)
        .run({ silenceTimeout: true })
    );
  });

  it('should call the errorRequest http hook after catching an error on the http request', () => {
    const error = 'network error';
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockRejectedValue(error);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(errorRequest, request)
        .run({ silenceTimeout: true })
    );
  });

  it('should not dispatch the entity action when the shouldDispatchEntityAction hook is provided and returns false', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(completeRequest, request)
        .run({ silenceTimeout: true })
    );
  });

  it('should not execute the before and after entity action hooks when the shouldDispatchEntityAction hook is provided and returns false', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const shouldDispatchEntityAction = jest.fn().mockResolvedValue(false);
    const beforeDispatchEntityAction = jest.fn();
    const afterDispatchEntityAction = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        beforeDispatchEntityAction,
        afterDispatchEntityAction,
        shouldDispatchEntityAction,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .not.call(dispatchFn)
        .not.call(beforeDispatchEntityAction)
        .not.call(afterDispatchEntityAction)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute the beforeDispatchEntityAction hook', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const beforeDispatchEntityAction = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        beforeDispatchEntityAction,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(beforeDispatchEntityAction, response, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute the afterDispatchEntityAction hook', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const afterDispatchEntityAction = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        afterDispatchEntityAction,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(afterDispatchEntityAction, dispatchAction, response, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute onFinish hook when finishing the entitySaga process', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn();
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockResolvedValue(response);
    const rollbackApiCall = jest.fn();
    const onFinish = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        onFinish,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(onFinish, entity)
        .run({ silenceTimeout: true })
    );
  });

  it('should dispatch a rollbackAction when catching an error and dispatched the dispatch action', () => {
    const error = 'network error';
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn().mockReturnValue(rollbackAction);
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockReturnValue(response);
    const afterDispatchEntityAction = jest.fn().mockRejectedValue(error);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        // lets insert an error after dispatching the action
        afterDispatchEntityAction,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .put(rollbackAction)
        .run({ silenceTimeout: true })
    );
  });

  it('should execute onError hook when catching an error', () => {
    const error = 'network error';
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn().mockReturnValue(rollbackAction);
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockReturnValue(response);
    const onError = jest.fn();
    const afterDispatchEntityAction = jest.fn().mockRejectedValue(error);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        // lets insert an error after dispatching the action
        afterDispatchEntityAction,
        onError,
      },
    );

    return (
      expectSaga(entitySaga, entity, httpOpts)
        .call(onError, error)
        .run({ silenceTimeout: true })
    );
  });

  // missing cancellation tests
  it('should call the onCance hook after cancelling the http request', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn().mockReturnValue(rollbackAction);
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockReturnValue(response);
    const rollbackApiCall = jest.fn();
    const onCancel = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
      {
        onCancel,
      },
    );

    function* cancelSaga() {
      const task = yield fork(entitySaga, entity, httpOpts);
      yield cancel(task);
    }

    return (
      expectSaga(cancelSaga)
        .call(onCancel, entity)
        .run()
    );
  });

  it('should dispatch a rollback action after cancelling the http request', () => {
    const dispatchFn = jest.fn().mockReturnValue(dispatchAction);
    const rollbackFn = jest.fn().mockReturnValue(rollbackAction);
    const createRequest = jest.fn().mockReturnValue(request);
    const completeRequest = jest.fn();
    const errorRequest = jest.fn();
    const cancelRequest = jest.fn();
    const apiCall = jest.fn().mockReturnValue(response);
    const rollbackApiCall = jest.fn();

    const httpOpts = {};

    const entitySaga = createEntitySaga(
      {
        dispatch: apiCall,
        rollback: rollbackApiCall,
      },
      {
        dispatch: dispatchFn,
        rollback: rollbackFn,
      },
      {
        createRequest,
        completeRequest,
        errorRequest,
        cancelRequest,
      },
    );

    function* cancelSaga() {
      const task = yield fork(entitySaga, entity, httpOpts);
      yield cancel(task);
    }

    return (
      expectSaga(cancelSaga)
        .put(rollbackAction)
        .run()
    );
  });
});
