import * as React from 'react';
import { Header } from 'components'
import { connect } from 'react-redux';
import { getStatusRequest } from 'actions/authentication';

class App extends React.Component {

  componentDidMount() { //컴포넌트 렌더링이 맨 처음 완료된 이후에 바로 세션확인
    // get cookie by name
    function getCookie(name) {
      const value = "; " + document.cookie;
      const parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    // get loginData from cookie
    let loginData = getCookie('key');

    // if loginData is undefined, do nothing
    if (typeof loginData === "undefined") return;

    // decode base64 & parse json
    loginData = JSON.parse(atob(loginData));

    // if not logged in, do nothing
    if (!loginData.isLoggedIn) return;

    // page refreshed & has a session in cookie,
    // check whether this cookie is valid or not
    this.props.getStatusRequest().then(
      () => {
        // if session is not valid
        if (!this.props.status.valid) {
          // logout the session
          loginData = {
            isLoggedIn: false,
            username: ''
          };

          document.cookie = 'key=' + btoa(JSON.stringify(loginData));

          // and notify
          const $toastContent = $('<span style="color: #FFB4BA">Your session is expired, please log in again</span>');
          M.toast({html: $toastContent});
        }
      }
    );
  }

  render() {
    /* Check whether current route is login or register using regex */
    const re = /(login|register)/;
    const isAuth = re.test(this.props.location.pathname);

    return (
      <React.Fragment>
        {isAuth ? undefined : <Header isLoggedIn={this.props.status.isLoggedIn} />}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);