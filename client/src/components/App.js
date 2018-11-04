import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Timeline from './Timeline';

class App extends React.Component {
  render() {
    return (
      <div className="reddit-background">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/feed" component={Timeline} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
