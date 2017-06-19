import React, {Component} from 'react';
import {Switch, Route, withRouter} from 'react-router-dom'
import Navbar from './Navbar';
import Home from 'components/Home.jsx';
import Agents from 'components/Agents.jsx';
import Agent from 'components/Agent.jsx';
import CreateProject from 'components/CreateProject.jsx';
import CreateConfiguration from 'components/CreateConfiguration.jsx';
import Configuration from 'components/Configuration.jsx';
import NotFound from 'components/NotFound.jsx';

import 'stylesheets/commons.scss';

const PrivateRoute = ({ component: Component, ...rest }) => {

    return <Route {...rest} render={(props) => (
        rest.isAuthenticated ? (
            Component?<Component {...rest}/>:rest.render()
        ) : (
            <Redirect to={{
                pathname: '/loginerror',
                state: {from: props.location}
            }}/>
        )
    )}/>
};


class Base extends Component {

    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.signout = this.signout.bind(this);
        this.state = {
            isAuthenticated : localStorage.getItem('isAuthenticated'),
            user : JSON.parse(localStorage.getItem('user'))
        }

    }

    signout() {
        this.setState({isAuthenticated : false, user : {}});
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
    }

    authenticate(user) {

        this.setState({isAuthenticated : true, user});
        localStorage.setItem('isAuthenticated', true);
        localStorage.setItem('user', JSON.stringify(user));

    }

    componentDidMount() {

        if(user) {
            let userData = { FirstName : user.FirstName, LastName : user.LastName, WWID : user.WWID, EmailAddress : user.EmailAddress};
            this.authenticate(userData);
        }

        if(loggedOut && loggedOut==true) {
            this.signout();
        }
    }

    render() {
        return (
            <div id="content" className="page">

                <Navbar {...this.props}/>

                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route exact path='/agents' component={Agents} />
                    <Route path='/agents/:agentName' component={Agent} />
                    <Route path='/createconfiguration' component={CreateConfiguration} />
                    <Route path='/createproject' component={CreateProject} />
                    <Route exact path='/configuration/:configurationName' component={Configuration} />
                    <Route path='*' component={() => (<NotFound msg="Page Not Found" />)} />
                </Switch>

            </div>
        );
    }

}

export default withRouter(Base);