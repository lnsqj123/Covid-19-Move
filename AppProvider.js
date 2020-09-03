import React, { useReducer } from 'react';

import createCtx from './createCtx';

const [useCtx, Provider] = createCtx();

export const ActionType = {
  SetAppLoading: 'set-app-loading',
  ResetUser: 'reset-user',
  SetUser: 'set-user',
  SetUserPoint: 'set-user-point',
  CallDefault: 'call-default',
}

const initialState = {
  user: null,
};


const callDefault = (dispatch) => () => {
  dispatch({
    type: ActionType.CallDefault,
  });
};

const setAppLoading = (dispatch) =>
 (loading) => {
  dispatch({
    type: ActionType.SetAppLoading,
    payload: loading,
  });
};

const setUser = (dispatch) => 
  (user) => {
    dispatch({
      type: ActionType.SetUser,
      payload: user,
    });
};

const setUserPoint = (dispatch) => 
  (point) => {
    dispatch({
      type: ActionType.SetUserPoint,
      payload: point,
    });
};

const resetUser = (dispatch) => () => {
  dispatch({
    type: ActionType.ResetUser,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'reset-user':
      return initialState;
    case 'set-user':
      return { 
        ...state,
        user: action.payload
      };
    case 'set-user-point':
      if (!state.user) {
        return state;
      }
      return {
        ...state,
        user: {
          ...state.user,
          point: action.payload,
        },
      };
    case 'set-app-loading':
      return { 
        ...state,
        appLoading: action.payload
      };
    default:
      return state;
  }
};

function AppProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = {
    setAppLoading: setAppLoading(dispatch),
    setUser: setUser(dispatch),
    setUserPoint: setUserPoint(dispatch),
    resetUser: resetUser(dispatch),
    callDefault: callDefault(dispatch),
  };

  return <Provider value={{ state, ...actions }}>{props.children}</Provider>;
}

export { useCtx as useAppContext, AppProvider };
