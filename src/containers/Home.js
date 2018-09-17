import * as React from 'react';
import { Write, MemoList } from 'components';
import { connect } from 'react-redux';
import { memoPostRequest, memoListRequest } from 'actions/memo';

class Home extends React.Component {

  componentDidMount() {
    // DO THE INITIAL LOADING
    this.props.memoListRequest(true, undefined, undefined, undefined);
  }

  handlePost = (contents) => {
    return this.props.memoPostRequest(contents).then(
      () => {
        if (this.props.postStatus.status === "SUCCESS") {
          // TRIGGER LOAD NEW MEMO
          M.toast({ html: 'Success!' });
        }else {
          /*
            ERROR CODES
                1: NOT LOGGED IN
                2: CONTENTS IS NOT STRING
                3: EMPTY CONTENTS
          */
          let $toastContent;
          switch (this.props.postStatus.error) {
            case 1:
              // IF NOT LOGGED IN, NOTIFY AND REFRESH AFTER
              $toastContent = $('<span style="color: #FFB4BA">You are not logged in</span>');
              M.toast({html: $toastContent});
              setTimeout(() => { location.reload(false); }, 2000);
              break;
            case 2:
              $toastContent = $('<span style="color: #FFB4BA">Contents should be string</span>');
              M.toast({html: $toastContent});
              break;
            case 3:
              $toastContent = $('<span style="color: #FFB4BA">Please write Something</span>');
              M.toast({html: $toastContent});
              break;
            default:
              $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
              M.toast({html: $toastContent});
              break;
          }
        }
      }
    )
  }

  render() {
    const write = ( <Write onPost = {this.handlePost}/> );
    return (
      <div className="wrapper">
        { this.props.isLoggedIn ? write : undefined }
        <MemoList data={this.props.memoData}
                  currentUser={this.props.currentUser}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authentication.status.isLoggedIn,
    postStatus: state.memo.post,
    currentUser: state.authentication.status.currentUser,
    memoData: state.memo.list.data,
    listStatus: state.memo.list.status,
    isLast: state.memo.list.isLast
};
}

const mapDispatchToProps = (dispatch) => {
  return {
      memoPostRequest: (contents) => {
          return dispatch(memoPostRequest(contents));
      },
      memoListRequest: (isInitial, listType, id, username) => {
          return dispatch(memoListRequest(isInitial, listType, id, username));
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);