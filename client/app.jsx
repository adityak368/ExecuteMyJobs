import React, {Component} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Home from 'components/Home.jsx';
import Agents from 'components/Agents.jsx';
import Agent from 'components/Agent.jsx';
import CreateProject from 'components/CreateProject.jsx';
import CreateConfiguration from 'components/CreateConfiguration.jsx';
import Configuration from 'components/Configuration.jsx';
import NotFound from 'components/NotFound.jsx';

export default class App extends Component {
  render() {
        return (<BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/agents' component={Agents} />
                        <Route path='/agents/:agentName' component={Agent} />
                        <Route path='/createconfiguration' component={CreateConfiguration} />
                        <Route path='/createproject' component={CreateProject} />
                        <Route exact path='/configuration/:configurationName' component={Configuration} />
                        <Route path='*' component={() => (<NotFound msg="Page Not Found" />)} />
                    </Switch>
                </BrowserRouter>);
  }
}
