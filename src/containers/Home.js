import * as React from 'react';
import { Write, MemoList } from 'components';
import { connect } from 'react-redux';
import { memoPostRequest, memoListRequest } from 'actions/memo';

class Home extends React.Component {

  handlePost = (contents) => {
    return this.props.memoPostRequest(contents).then(
      () => {
        if (this.props.postStatus.status === "SUCCESS") {
          // TRIGGER LOAD NEW MEMO
          this.loadNewMemo().then(
            () => {
              M.toast({ html: 'Success!' });
            }
          );
        } else {
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
              M.toast({ html: $toastContent });
              setTimeout(() => { location.reload(false); }, 2000);
              break;
            case 2:
              $toastContent = $('<span style="color: #FFB4BA">Contents should be string</span>');
              M.toast({ html: $toastContent });
              break;
            case 3:
              $toastContent = $('<span style="color: #FFB4BA">Please write Something</span>');
              M.toast({ html: $toastContent });
              break;
            default:
              $toastContent = $('<span style="color: #FFB4BA">Something Broke</span>');
              M.toast({ html: $toastContent });
              break;
          }
        }
      }
    )
  }

  loadNewMemo() {
    // CANCEL IF THERE IS A PENDING REQUEST
    if (this.props.listStatus === 'WAITING')
      return new Promise((resolve, reject) => {
        resolve();
      });

    // IF PAGE IS EMPTY, DO THE INITIAL LOADING
    if (this.props.memoData.length === 0)
      return this.props.memoListRequest(true);

    return this.props.memoListRequest(false, 'new', this.props.memoData[0]._id);
  }

  componentDidMount() {
    // LOAD NEW MEMO EVERY 5 SECONDS
    const loadMemoLoop = () => {
      this.loadNewMemo().then(
        () => {
          this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
        }
      );
    };

    this.props.memoListRequest(true).then(
      () => {
        // BEGIN NEW MEMO LOADING LOOP
        loadMemoLoop();
      }
    );
  }

  componentWillUnmount() {
    // STOPS THE loadMemoLoop
    clearTimeout(this.memoLoaderTimeoutId);
  }

  render() {
    const write = (<Write onPost={this.handlePost} />);
    return (
      <div className="wrapper">
        {this.props.isLoggedIn ? write : undefined}
        <MemoList data={this.props.memoData}
          currentUser={this.props.currentUser} />
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