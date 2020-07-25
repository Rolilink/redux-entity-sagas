import { put, cancelled, call } from 'redux-saga/effects';

interface IEntitySagaApiCallMethods {
  dispatch: any,
  rollback: any,
}

interface IEntitySagaActionCreators {
  dispatch: any,
  rollback: any,
}

interface IEntitySagaHttpHooks {
  createRequest: any,
  completeRequest: any,
  errorRequest: any,
  cancelRequest: any,
}

interface IEntitySagaHooks {
  onStart?: any,
  beforeApiCall?: any,
  shouldDoApiCall?: any,
  afterApiCall?: any,
  beforeDispatchEntityAction?: any,
  shouldDispatchEntityAction?: any,
  afterDispatchEntityAction?: any,
  onFinish?: any,
  onError?: any,
  onCancel?: any,
}

interface IEntitySagaOptions {
  getIdFromResourceOrResult?: any,
}

const defaultFn = () => {};
const alwaysTrueFn = async () => true;
const defaultGetIdFromResourceOrResult = (resource: any, result: any) => (
  resource || result
);

export default function createEntitySaga(
  apiCallMethods: IEntitySagaApiCallMethods,
  actionCreators: IEntitySagaActionCreators,
  httpHooks: IEntitySagaHttpHooks,
  hooks: IEntitySagaHooks = {},
  opts: IEntitySagaOptions = {},
) {
  const onStart = hooks.onStart || defaultFn;
  const beforeApiCall = hooks.beforeApiCall || defaultFn;
  const shouldDoApiCallFn = hooks.shouldDoApiCall || alwaysTrueFn;
  const afterApiCall = hooks.afterApiCall || defaultFn;
  const shouldDispatchEntityActionFn = hooks.shouldDispatchEntityAction || alwaysTrueFn;
  const beforeDispatchEntityAction = hooks.beforeDispatchEntityAction || defaultFn;
  const afterDispatchEntityAction = hooks.afterDispatchEntityAction || defaultFn;
  const onFinish = hooks.onFinish || defaultFn;
  const onError = hooks.onError || defaultFn;
  const onCancel = hooks.onCancel || defaultFn;

  const getIdFromResourceOrResult = (
    opts.getIdFromResourceOrResult || defaultGetIdFromResourceOrResult
  );

  return function* entitySaga(entity: any, httpOpts: any) {
    let response = null;
    let httpRequestSent = false;
    let actionDispatched = false;
    let request = null;

    try {
      yield call(onStart, entity);
      const shouldDoApiCall = yield call(shouldDoApiCallFn, entity);
      // create the resource if not finalize the saga
      if (shouldDoApiCall) {
        yield call(beforeApiCall, entity);

        request = yield call(httpHooks.createRequest, entity);

        // call api endpoint
        response = yield call(apiCallMethods.dispatch, entity, httpOpts);
        httpRequestSent = true;

        yield call(httpHooks.completeRequest, request);

        yield call(afterApiCall, response, entity);

        const shouldDispatchEntityAction = yield call(
          shouldDispatchEntityActionFn,
          response,
          entity
        );

        if (shouldDispatchEntityAction) {
          yield call(beforeDispatchEntityAction, response, entity);
          const action = actionCreators.dispatch(response);
          yield put(action);
          actionDispatched = true;
          yield call(afterDispatchEntityAction, action, response, entity);
        }
      }
      yield call(onFinish, entity);
    } catch (e) {
      yield call(onError, e);
      yield call(httpHooks.errorRequest, request);
      if (actionDispatched) {
        const rollbackAction = actionCreators.rollback(
          getIdFromResourceOrResult(entity, response),
        );
        yield put(rollbackAction);
      }
    } finally {
      if (yield cancelled()) {
        const rollbackAction = actionCreators.rollback(
          getIdFromResourceOrResult(entity, response),
        );

        if (httpRequestSent) {
          yield call(httpHooks.cancelRequest, request);
          yield call(apiCallMethods.rollback, entity, response);
        }

        yield put(rollbackAction);
        yield call(onCancel, entity);
      }
    }
  };
}
