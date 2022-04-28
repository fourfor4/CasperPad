import { Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './redux/store';

import './App.css';

import Home from './pages/Home';
import Projects from './pages/Projects';
import Staking from './pages/Staking';
import Error from './pages/Error';
import Project from './pages/Project'

function App() {
  return (
    <Provider store={store}>
      <Switch>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Projects />
        </Route>
        <Route path="/project/:address">
          <Project />
        </Route>
        <Route exact path="/staking/">
          <Staking />
        </Route>
        <Route exact path="/error/">
          <Error />
        </Route>
      </Switch>
    </Provider>
  );
  
}

export default App;
