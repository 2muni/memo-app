import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keyword: ''
    };

    // LISTEN ESC KEY, CLOSE IF PRESSED
    const listenEscKey = (evt) => {
      evt = evt || window.event;
      if (evt.keyCode == 27) {
        this.handleClose();
      }
    };

    document.onkeydown = listenEscKey;

  }

  handleClose = () => {
    this.handleSearch(''); // 종료될 때 공백을 검색함으로 검색목록(배열)을 비운다
    document.onkeydown = null; // 컨스트럭터에서 리스닝한 onkeydown 이벤트를 해제
    this.props.onClose();
  }

  handleSearch = (keyword) => {
    this.props.onSearch(keyword);
  }

  handleChange = (e) => {
    this.setState({
      keyword: e.target.value
    });
    this.handleSearch(e.target.value);
  }

  handleKeyDown = (e) => {
    // IF PRESSED ENTER, TRIGGER TO NAVIGATE TO THE FIRST USER SHOWN
    if (e.keyCode === 13) {
      if (this.props.usernames.length > 0) {
        this.props.history.push('/wall/' + this.props.usernames[0].username);
        this.handleClose();
      }
    }
  }

  render() {
    const mapDataToLinks = (data) => {
      return data.map((user, i) => {
        return (
          <Link onClick={this.handleClose} to={`/wall/${user.username}`} key={i}>
            {user.username}
          </Link>
        );
      });
    };

    return (
      <div className="search-screen white-text">
        <div className="right">
          <a className="waves-effect waves-light btn red lighten-1"
            onClick={this.handleClose}>CLOSE</a>
        </div>
        <div className="container">
          <input placeholder="Search a user"
            value={this.state.keyword}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}></input>
          <ul className="search-results">
            {mapDataToLinks(this.props.usernames)}
          </ul>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  onClose: PropTypes.func,
  onSearch: PropTypes.func,
  usernames: PropTypes.array,
  history: PropTypes.object
};

Search.defaultProps = {
  onClose: () => {
    console.error('onClose not defined');
  },
  onSearch: () => {
    console.error('onSearch not defined');
  },
  usernames: [],
  history: {}
};

export default Search;

