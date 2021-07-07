import React from 'react';

import Login from './components/Login/Login';
import { reducer, initState } from './reducer';

import classes from './App.module.scss';
import Chat from './components/Chat/Chat';

function App() {
  const [state, dispatch] = React.useReducer(reducer, initState);

  const isLogin = state.user || state.room;

  return (
    <div className={classes.app}>
      {!isLogin ? (<Login state={state} dispatch={dispatch}/>) : <Chat state={state} dispatch={dispatch}/>}
    </div>
  );
}

export default App;
