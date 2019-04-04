import React, { Component } from 'react';
import './App.css';
import { HashRouter, Route } from 'react-router-dom';
import Main from "./Main"
import TopBar from "./TopBar"
import CCentralApi from "./CCentralApi"
import ErrorBar from "./Error"
import Service from './services/Service';

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.ccApi = new CCentralApi()
  }

  render() {
    return (
      <HashRouter>
        <div className="App">
          <TopBar api={this.ccApi} />
          <header className="App-header">
            <ErrorBar ccApi={this.ccApi} />
            <Route exact path="/" component={Main} />
            <Route path="/home" component={Main} />
            <Route path="/service/:serviceId" render={(props) =>
              <Service
                ccApi={this.ccApi}
                serviceId={props.match.params.serviceId}
              />} />
          </header>
        </div>
      </HashRouter>
    );
  }
}

export default App;
