import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
 
class Authentication extends Component {
    state = {
      username:"",
      password:""
    }
 
    handleChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }
 
    handleRegister = () => {
        let id = this.state.username;
        let pw = this.state.password;
 
        this.props.onRegister(id, pw).then(
            (result) => {
                if(!result) {
                    this.setState({
                        username: '',
                        password: ''
                    });
                }
            }
        );
    }
 
    render() {
        const inputBoxes = (
            <div>
                <div className="input-field col s12 username">
                    <label>Username</label>
                    <input
                    name="username"
                    type="text"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.username}/>
                </div>
                <div className="input-field col s12">
                    <label>Password</label>
                    <input
                    name="password"
                    type="password"
                    className="validate"
                    onChange={this.handleChange}
                    value={this.state.password}/>
                </div>
            </div>
        );
 
        const loginView = (
            <div>
                <div className="card-content">
                    <div className="row">
                        {inputBoxes}
                        <a className="waves-effect waves-light btn">SUBMIT</a>
                    </div>
                </div>
 
 
                <div className="footer">
                    <div className="card-content">
                        <div className="right" >
                        New Here? <Link to="/register">Create an account</Link>
                        </div>
                    </div>
                </div>
 
            </div>
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
                  {this.props.mode ? loginView : registerView }
              </div>
          </div>
        );
    }
}
 
Authentication.propTypes = {
    mode: PropTypes.bool,
    onRegister: PropTypes.func
};
 
Authentication.defaultProps = {
    mode: true,
    onRegister: (id, pw) => { console.error("register function is not defined"); }
};
 
export default Authentication;