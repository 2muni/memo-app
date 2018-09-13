import React from 'react';
import ReactDOM from 'react-dom';
 
const title = 'React Webpack Babel@6 Hot-Module';
 
ReactDOM.render(
  <div>{title}</div>,
  document.getElementById('root')
);

module.hot.accept();