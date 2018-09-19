import * as React from 'react';
import { Header } from 'components'
import { connect } from 'react-redux';
import { getStatusRequest, logoutRequest } from 'actions/authentication';
import { searchRequest } from 'actions/search';

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
          M.toast({ html: $toastContent });
        }
      }
    );
  }

  handleLogout = () => {
    this.props.logoutRequest().then(
      () => {
        M.toast({ html: 'Good Bye!' });

        // EMPTIES THE SESSION
        let loginData = {
          isLoggedIn: false,
          username: ''
        };

        document.cookie = 'key=' + btoa(JSON.stringify(loginData));
      }
    );
  }

  handleSearch = (keyword) => {
    this.props.searchRequest(keyword);
  }

  render() {
    /* Check whether current route is login or register using regex */
    const re = /(login|register)/;
    const isAuth = re.test(this.props.location.pathname);

    return (
      <React.Fragment>
        {isAuth ? undefined : <Header isLoggedIn={this.props.status.isLoggedIn}
          onLogout={this.handleLogout}
          onSearch={this.handleSearch}
          usernames={this.props.searchResults}
          history={this.props.history} />}

      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.status,
    searchResults: state.search.usernames
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getStatusRequest: () => {
      return dispatch(getStatusRequest());
    },
    logoutRequest: () => {
      return dispatch(logoutRequest());
    },
    searchRequest: (keyword) => {
      return dispatch(searchRequest(keyword));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);