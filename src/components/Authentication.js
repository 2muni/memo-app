import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Authentication extends React.Component {
  state = {
    username: "",
    password: ""
  }

  handleChange = (e) => {
    const nextState = {};
    nextState[e.target.name] = e.target.value;
    this.setState(nextState);
  }

  handleRegister = () => {
    const id = this.state.username;
    const pw = this.state.password;

    this.props.onRegister(id, pw).then(
      (result) => {
        if (!result) {
          this.setState({
            username: '',
            password: ''
          });
        }
      }
    );
  }

  handleLogin = () => {
    const id = this.state.username;
    const pw = this.state.password;

    this.props.onLogin(id, pw).then(
      (success) => {
        if(!success) {
          this.setState({
            password: ''
          })
        }
      }
    )
  }

  render() {
    const inputBoxes = (
      <React.Fragment>
        <div className="input-field col s12 username">
          <label>Username</label>
          <input
            name="username"
            type="text"
            className="validate"
            onChange={this.handleChange}
            value={this.state.username} />
        </div>
        <div className="input-field col s12">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="validate"
            onChange={this.handleChange}
            value={this.state.password} />
        </div>
      </React.Fragment>
    );

    const loginView = (
      <React.Fragment>
        <div className="card-content">
          <div className="row">
            {inputBoxes}
            <a className="waves-effect waves-light btn"
              onClick={this.handleLogin}>SUBMIT</a>
          </div>
        </div>


        <div className="footer">
          <div className="card-content">
            <div className="right" >
              New Here? <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );

    const registerView = (
      <div className="card-content">
        <div className="row">
          {inputBoxes}
          <a className="waves-effect waves-light btn"
            onClick={this.handleRegister}>CREATE</a>
        </div>
      </div>
    );

    return (
      <div className="container auth">
        <Link className="logo" to="/">MEMOPAD</Link>
        <div className="card">
          <div className="header blue white-text center">
            <div className="card-content">{this.props.mode ? "LOGIN" : "REGISTER"}</div>
          </div>
          {this.props.mode ? loginView : registerView}
        </div>
      </div>
    );
  }
}

Authentication.propTypes = {
  mode: PropTypes.bool,
  onRegister: PropTypes.func,
  onLogin: PropTypes.func
};

Authentication.defaultProps = {
  mode: true,
  onRegister: (id, pw) => { console.error("register function is not defined"); },
  onLogin: (id, pw) => { console.error("login function not defined"); }
};

export default Authentication;