import * as React from 'react';
import { Write } from 'components';
import { connect } from 'react-redux';
import { memoPostRequest } from 'actions/memo';

class Home extends React.Component {
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
    console.log(this.props.postStatus);
    return (
      <div className="wrapper">
        { this.props.isLoggedIn ? write : undefined }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.authentication.status.isLoggedIn,
    postStatus: state.memo.post
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    memoPostRequest: (contents) => {
      return dispatch(memoPostRequest(contents));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);