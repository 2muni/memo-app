import * as React from 'react';
import { Write, MemoList } from 'components';
import { connect } from 'react-redux';
import { memoPostRequest, memoListRequest, memoEditRequest, memoRemoveRequest } from 'actions/memo';

class Home extends React.Component {

  state = {
    loadingState: false
  }

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

  handleEdit = (id, index, contents) => {
    return this.props.memoEditRequest(id, index, contents).then(
      () => {
        if (this.props.editStatus.status === "SUCCESS") {
          M.toast({ html: 'Success!' });
        } else {
          /*
            ERROR CODES
                1: INVALID ID,
                2: CONTENTS IS NOT STRING
                3: EMPTY CONTENTS
                4: NOT LOGGED IN
                5: NO RESOURCE
                6: PERMISSION FAILURE
          */
          let errorMessage = [
            'Something broke',
            'Contents should be string',
            'Please write something',
            'You are not logged in',
            'That memo does not exist anymore',
            'You do not have permission'
          ];

          let error = this.props.editStatus.error;

          // NOTIFY ERROR
          let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[error - 1] + '</span>');
          M.toast({ html: $toastContent });

          // IF NOT LOGGED IN, REFRESH THE PAGE AFTER 2 SECONDS
          if (error === 4) {
            setTimeout(() => { location.reload(false) }, 2000);
          }

        }
      }
    );
  }

  handleRemove = (id, index) => {
    this.props.memoRemoveRequest(id, index).then(() => {
      if (this.props.removeStatus.status === "SUCCESS") {
        // LOAD MORE MEMO IF THERE IS NO SCROLLBAR
        // 1 SECOND LATER. (ANIMATION TAKES 1SEC)
        // 메모를 지우는 통신을 성공하고 1초 뒤에 스크롤이 있는지 확인 => 없으면 전 메모 불러와 스크롤 생성
        setTimeout(() => {
          if ($("body").height() < $(window).height()) {
            this.loadOldMemo();
          }
        }, 1000);
      } else {
        // ERROR
        /*
            DELETE MEMO: DELETE /api/memo/:id
            ERROR CODES
                1: INVALID ID
                2: NOT LOGGED IN
                3: NO RESOURCE
                4: PERMISSION FAILURE
        */
        let errorMessage = [
          'Something broke',
          'You are not logged in',
          'That memo does not exist',
          'You do not have permission'
        ];

        // NOTIFY ERROR
        let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.removeStatus.error - 1] + '</span>');
        M.toast({html: $toastContent});


        // IF NOT LOGGED IN, REFRESH THE PAGE
        if (this.props.removeStatus.error === 2) {
          setTimeout(() => { location.reload(false) }, 2000);
        }
      }
    });
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

  loadOldMemo = () => {
    // CANCEL IF USER IS READING THE LAST PAGE
    if (this.props.isLast) {
      return new Promise(
        (resolve, reject) => {
          resolve();
        }
      );
    }

    // GET ID OF THE MEMO AT THE BOTTOM
    let lastId = this.props.memoData[this.props.memoData.length - 1]._id;

    // START REQUEST
    return this.props.memoListRequest(false, 'old', lastId, this.props.username).then(() => {
      // IF IT IS LAST PAGE, NOTIFY
      if (this.props.isLast) {
        M.toast({ html: 'You are reading the last page' });
      }
    });
  }

  componentDidMount() {
    // LOAD NEW MEMO EVERY 5 SECONDS
    const loadMemoLoop = () => {
      this.loadNewMemo().then(
        () => {
          this.memoLoaderTimeoutId = setTimeout(loadMemoLoop, 5000);
        }
      );
      $(window).scroll(() => {
        // WHEN HEIGHT UNDER SCROLLBOTTOM IS LESS THEN 250
        if ($(document).height() - $(window).height() - $(window).scrollTop() < 250) {
          if (!this.state.loadingState) {
            this.loadOldMemo();
            this.setState({
              loadingState: true
            });
          }
        } else {
          if (this.state.loadingState) {
            this.setState({
              loadingState: false
            });
          }
        }
      });
    };

    const loadUntilScrollable = () => {
      // IF THE SCROLLBAR DOES NOT EXIST,
      if ($("body").height() < $(window).height()) {
        this.loadOldMemo().then(
          () => {
            // DO THIS RECURSIVELY UNLESS IT'S LAST PAGE
            if (!this.props.isLast) {
              loadUntilScrollable();
            }
          }
        );
      }
    };

    this.props.memoListRequest(true).then(
      () => {
        // BEGIN NEW MEMO LOADING LOOP
        loadUntilScrollable();
        loadMemoLoop();
      }
    );

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

    // REMOVE WINDOWS SCROLL LISTENER
    $(window).unbind();
  }

  render() {
    const write = (<Write onPost={this.handlePost} />);
    return (
      <div className="wrapper">
        {this.props.isLoggedIn ? write : undefined}
        <MemoList data={this.props.memoData}
          currentUser={this.props.currentUser}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove} />
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
    isLast: state.memo.list.isLast,
    editStatus: state.memo.edit,
    removeStatus: state.memo.remove
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    memoPostRequest: (contents) => {
      return dispatch(memoPostRequest(contents));
    },
    memoListRequest: (isInitial, listType, id, username) => {
      return dispatch(memoListRequest(isInitial, listType, id, username));
    },
    memoEditRequest: (id, index, contetns) => {
      return dispatch(memoEditRequest(id, index, contetns));
    },
    memoRemoveRequest: (id, index) => {
      return dispatch(memoRemoveRequest(id, index));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);