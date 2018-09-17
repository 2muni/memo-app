import * as types from 'actions/ActionTypes';

const initialState = {
  post: {
    status: 'INIT',
    error: -1
  },
  list: {
    status: 'INIT',
    data: [],
    isLast: false
  },
  edit: {
    status: 'INIT',
    error: -1,
  },
  remove: {
    status: 'INIT',
    error: -1
  },
  star: {
    status: 'INIT',
    error: -1
  }
};

export default function memo(state = initialState, action) {
  switch (action.type) {
    case types.MEMO_POST:
      return {
        ...state,
        post: {
          ...state.post,
          status: 'WAITING',
          error: -1
        }
      };
    case types.MEMO_POST_SUCCESS:
      return {
        ...state,
        post: {
          ...state.post,
          status: 'SUCCESS'
        }
      };
    case types.MEMO_POST_FAILURE:
      return {
        ...state,
        post: {
          ...state.post,
          status: 'FAILURE',
          error: action.error
        }
      };
    case types.MEMO_LIST:
      return {
        ...state,
        list: {
          ...state.list,
          status: 'WAITING'
        }
      };
    case types.MEMO_LIST_SUCCESS:
      if (action.isInitial) {
        return {
          ...state,
          list: {
            ...state.list,
            status: 'SUCCESS',
            data: action.data,
            isLast: action.data.length < 6
          }
        }
      } else {
        if (action.listType === 'new') { // 배열의 앞부분에 추가
          return {
            ...state,
            list: {
              ...state.list,
              status: 'SUCCESS',
              data: [...action.data, ...state.list.data]
            }
          }
        } else { //action.listType === 'older' //배열의 뒷부분에 추가
          return {
            ...state,
            list: {
              ...state.list,
              status: 'SUCCESS',
              data: [...state.list.data, ...action.data],
              isLast: action.data.length < 6
            }
          }
        }
      }
      return state;
    case types.MEMO_LIST_FAILURE:
      return {
        ...state,
        list: {
          ...state.list,
          status: 'FAILURE'
        }
      };
    default:
      return state;
  }
}