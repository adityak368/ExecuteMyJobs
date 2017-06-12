import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import NoAgentsFound from 'components/NotFound';
import Base from 'components/Base';
import { initDomHandlers } from 'commons/domutils';

import '../styles/commons.css';

export default class Agents extends Component {

    constructor(props) {
        super(props);
        this.fetchAgents = this.fetchAgents.bind(this);
        this.fetchNumberOfAgents = this.fetchNumberOfAgents.bind(this);
        this.state = {connectedAgents: [], disconnectedAgents: [], unauthorizedAgents: [],agentCount : 0};
    }

    fetchAgents() {
        axios.get('/api/agents')
            .then((response) => {
                let allAgents = response.data;
                let connectedAgents = allAgents.filter((agent) => agent.isConnected);
                let disconnectedAgents = allAgents.filter((agent) => !agent.isConnected);
                let unauthorizedAgents = allAgents.filter((agent) => !agent.isAuthorized);
                this.setState({
                    connectedAgents,
                    disconnectedAgents,
                    unauthorizedAgents
                });
            })
            .catch((error) => {
                toastr.error(error.response.data.message, 'Error!');
            });
    }

    fetchNumberOfAgents() {
        axios.get('/api/agents/count')
            .then((response) => {
                this.setState({agentCount: response.data.message});
            })
            .catch((error) => {
                toastr.error(error.response.data.message, 'Error!');
            });
    }

    componentDidMount() {
        this.fetchNumberOfAgents();
        this.fetchAgents();
        initDomHandlers();

    }

    render() {
        const connectedAgents = this.state.connectedAgents.length == 0 ? <NoAgentsFound msg={'No Agents Found'}/> : (
            <div>
                {this.state.connectedAgents.map( (agent) =>
                        <div className="box" key={agent.name}>
                            <article className="media">
                                <div className="media-left">
                                    <figure className="image is-64x64">
                                        <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image"/>
                                    </figure>
                                </div>
                                <div className="media-content">
                                    <div className="content">
                                        <p>
                                            <Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link>
                                            <br />
                                            {agent.description}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>
                )}
            </div>);

        const disconnectedAgents = this.state.disconnectedAgents.length == 0 ?
            <NoAgentsFound msg={'No Agents Found'}/> : (
                <div>
                    {this.state.disconnectedAgents.map((agent) =>
                            <div className="box" key={agent.name}>
                                <article className="media">
                                    <div className="media-left">
                                        <figure className="image is-64x64">
                                            <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image"/>
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <div className="content">
                                            <p>
                                                <Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link>
                                                <br />
                                                {agent.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                    )}
                </div>);

        const unauthorizedAgents = this.state.unauthorizedAgents.length == 0 ?
            <NoAgentsFound msg={'No Agents Found'}/> : (
                <div>
                    {this.state.unauthorizedAgents.map((agent) =>
                            <div className="box" key={agent.name}>
                                <article className="media">
                                    <div className="media-left">
                                        <figure className="image is-64x64">
                                            <img src="http://bulma.io/images/placeholders/128x128.png" alt="Image"/>
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <div className="content">
                                            <p>
                                                <Link to={`/agents/${agent.name}`}><strong>{agent.name}</strong></Link>
                                                <br />
                                                {agent.description}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                    )}
                </div>);

        return (
            <Base agentCount={this.state.agentCount}>
                <div className="container" style={{marginTop: "3rem"}}>
                    <div className="columns">
                        <div className="column">
                            <div id="tabs" className="tabs is-toggle is-fullwidth">
                                <ul>
                                    <li className="is-active" data-tab="connected_agents">
                                        <a>
                                            <span className="icon is-small"><i className="fa fa-wifi"></i></span>
                                            <span>Connected Agents ({this.state.connectedAgents.length})</span>
                                        </a>
                                    </li>
                                    <li data-tab="disconnected_agents">
                                        <a>
                                            <span className="icon is-small"><i
                                                className="fa fa-minus-circle"></i></span>
                                            <span>Disconnected Agents ({this.state.disconnectedAgents.length})</span>
                                        </a>
                                    </li>
                                    <li data-tab="unauthorized_agents">
                                        <a>
                                            <span className="icon is-small"><i className="fa fa-shield"></i></span>
                                            <span>UnAuthorized Agents ({this.state.unauthorizedAgents.length})</span>
                                        </a>
                                    </li>
                                </ul>

                            </div>


                            <div className="tab-content is-active" id="connected_agents">
                                {connectedAgents}
                            </div>
                            <div className="tab-content" id="disconnected_agents">
                                {disconnectedAgents}
                            </div>
                            <div className="tab-content" id="unauthorized_agents">
                                {unauthorizedAgents}
                            </div>

                        </div>
                    </div>
                </div>
            </Base>
        );
    }

}
