import * as React from 'react';
import { Authentication } from 'components';
import { connect } from 'react-redux';
import { registerRequest } from 'actions/authentication';

class Register extends React.Component {
  handleRegister = (id, pw) => {
    return this.props.registerRequest(id, pw).then(
      () => {
        if (this.props.status === "SUCCESS") {
          M.toast({ html: 'Success! Please log in.' });
          this.props.history.push('/login');
          return true;
        } else {
          /*
              ERROR CODES:
                  1: BAD USERNAME
                  2: BAD PASSWORD
                  3: USERNAME EXISTS
          */
          let errorMessage = [
            'Invalid Username',
            'Password is too short',
            'Username already exists'
          ];

          let $toastContent = $('<span style="color: #FFB4BA">' + errorMessage[this.props.errorCode - 1] + '</span>');
          M.toast({ html: $toastContent });
          return false;
        }
      }
    );
  }

  render() {
    return (
      <Authentication mode={false}
        onRegister={this.handleRegister} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.authentication.register.status,
    errorCode: state.authentication.register.error
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    registerRequest: (id, pw) => {
      return dispatch(registerRequest(id, pw));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
