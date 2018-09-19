import * as types from 'actions/ActionTypes';

const initialState = {
  status: 'INIT',
  usernames: []
};

export default function search(state = initialState, action) {

  switch (action.type) {
    case types.SEARCH:
      return {
        ...state,
        status: 'WAITING'
      }
    case types.SEARCH_SUCCESS:
      return {
        ...state,
        status: 'SUCCESS',
        usernames: action.usernames
      }
    case types.SEARCH_FAILURE:
      return {
        ...state,
        status: 'FAILURE',
        usernames: []
      }
    default:
      return state;
  }
}
