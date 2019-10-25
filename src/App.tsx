import React from 'react';
import './App.scss';
import Pay from './pages/pay/Pay';
import Cash from './pages/cash/Cash';
import { HashRouter, Switch, Route,Redirect }  from "react-router-dom"

const App: React.FC = () => {
  
  return (
    <HashRouter>
      <Switch>
          <Route path="/pay" component={Pay} />
          <Route path="/cash" component={Cash} />
          <Redirect from="**" to="/pay" />
      </Switch>
  </HashRouter>
  );
}

export default App;
