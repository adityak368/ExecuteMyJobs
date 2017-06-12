import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

export default class Navbar extends Component {

    componentDidMount() {

    }

    render() {
        return (
                <nav className="nav has-shadow">
                    <div className="container">
                        <div className="nav-left">
                            <Link className="nav-item" to={'/'}>
                                <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma logo" />
                            </Link>
                            <Link to={'/agents'} className="nav-item is-tab is-hidden-mobile" data-nav="agents">Agents <span className="tag is-primary" style={{marginLeft:"1rem"}}>{this.props.agentCount} Authorized</span></Link>
                            <Link to={'/jobs'} className="nav-item is-tab is-hidden-mobile" data-nav="jobs">Jobs</Link>
                        </div>
                        <span id="nav-toggle" className="nav-toggle">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                        <div id="nav-menu" className="nav-right nav-menu">
                            <Link to={'/agents'} className="nav-item is-tab is-hidden-tablet" data-nav="agents">Agents <span className="tag is-primary" style={{marginLeft:"1rem"}}>{this.props.agentCount} Authorized</span></Link>
                            <Link to={'/jobs'} className="nav-item is-tab is-hidden-tablet" data-nav="jobs">Jobs</Link>
                            <Link to={'/login'} className="nav-item is-tab" data-nav="login">Log In</Link>
                        </div>
                    </div>
                </nav>
        );
    }

}


Navbar.defaultProps = {
    agentCount: 0
};
