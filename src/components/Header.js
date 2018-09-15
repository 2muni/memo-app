import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Header extends React.Component {

  render() {
    const loginButton = (
      <li>
        <Link to="/login">
          <i className="material-icons">vpn_key</i>
        </Link>
      </li>
    );

    const logoutButton = (
      <li>
        <a>
          <i className="material-icons">lock_open</i>
        </a>
      </li>
    );

    return (
      <nav className="nav-wrapper blue darken-1">
        <Link to="/" className="brand-logo center">MEMOPAD</Link>

        <ul>
          <li><a onClick={this.toggleSearch}><i className="material-icons">search</i></a></li>
        </ul>

        <div className="right">
          <ul>
            { this.props.isLoggedIn ? logoutButton : loginButton }
          </ul>
        </div>
      </nav>
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool
}

Header.defaultProps = {
  isLoggedIn: false
}

export default Header;