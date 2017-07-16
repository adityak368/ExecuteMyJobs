import React, {Component} from 'react'
import {Switch, Route, withRouter} from 'react-router-dom'
import Navbar from 'components/Navbar'
import Home from 'components/Home'
import Agents from 'components/Agents'
import Agent from 'components/Agent'
import CreateProject from 'components/CreateProject'
import CreateConfiguration from 'components/CreateConfiguration'
import Configuration from 'components/Configuration'
import NotFound from 'components/NotFound'
import Login from 'components/Login'

import {observer} from 'mobx-react'
import HomeStore from 'stores/HomeStore'
import ConfigurationStore from 'stores/ConfigurationStore'
import PropTypes from 'prop-types'

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
}

const renderMergedProps = (component, ...rest) => {
    const finalProps = Object.assign({}, ...rest)
    return (
        React.createElement(component, finalProps)
    )
}

const PropsRoute = ({ component, ...rest }) => {
    return (
        <Route {...rest} render={routeProps => {
            return renderMergedProps(component, routeProps, rest)
        }}/>
    )
}

@observer
class Base extends Component {
   
    componentDidMount() {

    }

    render() {
        return (
            <div id="content" className="page">

                <Navbar {...this.props} />

                <Switch>
                    <PropsRoute exact path='/' component={Home} store={HomeStore} />
                    <Route exact path='/agents' component={Agents} />
                    <Route path='/agents/:agentName' component={Agent} />
                    <Route path='/createconfiguration' component={CreateConfiguration} />
                    <Route path='/createproject' component={CreateProject} />
                    <PropsRoute exact path='/configuration/:configurationName' component={Configuration} store={ConfigurationStore} />
                    <Route exact path='/login' component={Login} />
                    <Route component={() => (<NotFound msg="Page Not Found" />)} />
                </Switch>

            </div>
        )
    }

}

Base.propTypes = {
    store : PropTypes.shape({
        isAuthenticated: PropTypes.bool.isRequired,
        user: PropTypes.object.isRequired
    })
}

Base.defaultProps = {
    store : {
        isAuthenticated: false,
        user : {}
    }
}

export default withRouter(Base)