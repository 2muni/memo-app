import * as React from 'react';
import { Memo } from 'components'
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MemoList extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    // 리턴값이  true 이면 render 메소드 실행
    const update = JSON.stringify(this.props) !== JSON.stringify(nextProps);
    return update;
  }

  render() {
    const mapToComponents = data => {
      return data.map((memo, i) => {
        return (
          <Memo
            data={memo}
            ownership={memo.writer === this.props.currentUser}
            key={memo._id}
            index={i}
            onEdit={this.props.onEdit}
            onRemove={this.props.onRemove}
            onStar={this.props.onStar}
            currentUser={this.props.currentUser}
          />
        );
      })
    }
    return (
      <React.Fragment>
        <ReactCSSTransitionGroup transitionName="memo"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={1000}>
          {mapToComponents(this.props.data)}
        </ReactCSSTransitionGroup>
      </React.Fragment>
    );
  }
}

MemoList.propTypes = {
  data: PropTypes.array,
  currentUser: PropTypes.string,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onStar: PropTypes.func
};

MemoList.defaultProps = {
  data: [],
  currentUser: '',
  onEdit: (id, index, contents) => {
    console.error('edit function not defined');
  },
  onRemove: (id, index) => {
    console.error('remove function not defined');
  },
  onStar: (id, index) => {
    console.error('star function not defined');
  }
};

export default MemoList;