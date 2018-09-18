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

    /* MEMO POST */
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

    /* MEMO LIST */
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
    case types.MEMO_EDIT:
      return {
        ...state,
        edit: {
          ...state.edit,
          status: 'WAITING',
          error: -1,
          memo: undefined
        }
      };

    /* MEMO EDIT */
    case types.MEMO_EDIT_SUCCESS:
      let editBefore = state.list.data.slice(0, action.index);
      let editAfter = state.list.data.slice(action.index + 1);
      return {
        ...state,
        edit: {
          ...state.edit,
          status: 'SUCCESS'
        },
        list: {
          ...state.list,
          data: [...editBefore, action.memo, ...editAfter]
        }
      };
    case types.MEMO_EDIT_FAILURE:
      return {
        ...state,
        edit: {
          ...state.edit,
          status: 'FAILURE',
          error: action.error
        }
      };

    /* MEMO REMOVE */
    case types.MEMO_REMOVE:
      return {
        ...state,
        remove: {
          ...state.remove,
          status: 'WAITING',
          error: -1
        }
      };
    case types.MEMO_REMOVE_SUCCESS:
      let removeBefore = state.list.data.slice(0, action.index);
      let removeAfter = state.list.data.slice(action.index + 1);
      return {
        ...state,
        remove: {
          ...state.remove,
          status: 'SUCCESS'
        },
        list: {
          ...state.list,
          data: [...removeBefore, ...removeAfter]
        }
      };
    case types.MEMO_REMOVE_FAILURE:
      return {
        ...state,
        remove: {
          ...state.remove,
          status: 'FAILURE',
          error: action.error
        }
      };
    default:
      return state;
  }
}