import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Register } from 'containers'
 
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';
 
const store = createStore(reducers, applyMiddleware(thunk));
 
const title = 'Memo_App!';
 
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/register" component={Register}/>
      </div>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
 
module.hot.accept();