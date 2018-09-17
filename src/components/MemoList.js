import * as React from 'react';
import { Memo } from 'components'
import PropTypes from 'prop-types';
 
class MemoList extends React.Component {
    render() {
      const mapToComponents = data => {
        return data.map((memo, i) => {
          return (
            <Memo
              data={memo}
              ownership={ memo.writer === this.props.currentUser }
              key={memo._id}
              index={i}
              />
          );
        })
      }
      return (
        <React.Fragment>
          { mapToComponents(this.props.data) }
        </React.Fragment>
      );
    }
}
 
MemoList.propTypes = {
    data: PropTypes.array,
    currentUser: PropTypes.string
};
 
MemoList.defaultProps = {
    data: [],
    currentUser: ''
};
 
export default MemoList;