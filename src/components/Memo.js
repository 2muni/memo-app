import * as React from 'react';
import TimeAgo from 'react-timeago';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Memo extends React.Component {

  state = {
    editMode: false,
    value: this.props.data.contents
  };

  toggleEdit = () => {
    if (this.state.editMode) {
      const id = this.props.data._id;
      const index = this.props.index;
      const contents = this.state.value;

      this.props.onEdit(id, index, contents).then(() => {
        this.setState({
          editMode: !this.state.editMode
        });
      })
    } else {
      this.setState({
        editMode: !this.state.editMode
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    });
  }

  handleRemove = () => {
    const id = this.props.data._id;
    const index = this.props.index;
    this.props.onRemove(id, index);
  }

  handleStar = () => {
    const id = this.props.data._id;
    const index = this.props.index;
    this.props.onStar(id, index);
  }

  componentDidUpdate() {
    // WHEN COMPONENT UPDATES, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN LOGGED IN)
    $('.dropdown-button').dropdown();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const current = {
      props: this.props,
      state: this.state
    };

    const next = {
      props: nextProps,
      state: nextState
    };

    const update = JSON.stringify(current) !== JSON.stringify(next);
    return update;
  }

  componentDidMount() {
    // WHEN COMPONENT MOUNTS, INITIALIZE DROPDOWN
    // (TRIGGERED WHEN REFRESHED)
    $('.dropdown-button').dropdown();
  }

  render() {
    // IF IT IS STARRED ( CHECKS WHETHER THE NICKNAME EXISTS IN THE ARRAY )
    // RETURN STYLE THAT HAS A YELLOW COLOR
    const starStyle = (this.props.data.starred.indexOf(this.props.currentUser) > -1) ? { color: '#ff9980' } : {};

    const dropDownMenu = (
      <div className="option-button">
        <a className='dropdown-button'
          data-target={`dropdown-${this.props.data._id}`}>
          <i className="material-icons icon-button">more_vert</i>
        </a>
        <ul id={`dropdown-${this.props.data._id}`} className='dropdown-content'>
          <li><a onClick={this.toggleEdit}>Edit</a></li>
          <li><a onClick={this.handleRemove}>Remove</a></li>
        </ul>
      </div>
    );

    const editedInfo = (
      <span style={{ color: '#AAB5BC' }}> · Edited <TimeAgo date={this.props.data.date.edited} live={true} /></span>
    );

    const memoView = (
      <div className="card">
        <div className="info">
          <Link to={`/wall/${this.props.data.writer}`} className="username">{this.props.data.writer}</Link> wrote a log · <TimeAgo date={this.props.data.date.created} />
          {this.props.data.is_edited ? editedInfo : undefined}
          {this.props.ownership ? dropDownMenu : undefined}
        </div>
        <div className="card-content">
          {this.props.data.contents}
        </div>
        <div className="footer">

          <i className="material-icons log-footer-icon star icon-button"
            style={starStyle}
            onClick={this.handleStar}>star</i>
          <span className="star-count">{this.props.data.starred.length}</span>
        </div>
      </div>
    );

    const editView = (
      <div className="write">
        <div className="card">
          <div className="card-content">
            <textarea
              className="materialize-textarea"
              value={this.state.value}
              onChange={this.handleChange}></textarea>
          </div>
          <div className="card-action">
            <a onClick={this.toggleEdit}>OK</a>
          </div>
        </div>
      </div>
    );

    return (
      <div className="container memo">
        {this.state.editMode ? editView : memoView}
      </div>
    );
  }
}

Memo.propTypes = {
  data: PropTypes.object,
  ownership: PropTypes.bool,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  index: PropTypes.number,
  onStar: PropTypes.func,
  currentUser: PropTypes.string
};

Memo.defaultProps = {
  data: {
    _id: 'id1234567890',
    writer: 'Writer',
    contents: 'Contents',
    is_edited: false,
    date: {
      edited: new Date(),
      created: new Date()
    },
    starred: []
  },
  ownership: true,
  onEdit: (id, index, contents) => {
    console.error('onEdit function not defined');
  },
  onRemove: (id, index) => {
    console.error('remove function not defined');
  },
  onStar: (id, index) => {
    console.error('star function not defined');
  },
  currentUser: '',
  index: -1
}

export default Memo;
