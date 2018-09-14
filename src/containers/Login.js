import * as React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { loginRequest} from 'actions/authentication';

class Login extends React.Component {

  handleLogin = (id, pw) => {
    return this.props.loginRequest(id, pw).then(
      () => {
        if(this.props.status === "SUCCESS") {
          const loginData = {
            isLoggedIn: true,
            username: id
          }

          document.cookie = 'key=' + btoa(JSON.stringify(loginData));

          M.toast({html: 'Welcome, '+ id + '!'});
          this.props.history.push('/');
          return true;
        }else {
          const $toastContent = $('<span style="color: #FFB4BA">Incorrect username or password</span>');
          M.toast({html: $toastContent});
          return false;
        }
      }
    );
  }

  render() {
    return (
      <Authentication mode={true}
        onLogin={this.handleLogin} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.login.status
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginRequest: (id, pw) => {
      return dispatch(loginRequest(id, pw));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);