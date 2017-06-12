import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import TreeView from 'components/TreeView/TreeView';
import Base from "components/Base";
import { initDomHandlers } from 'commons/domutils';
import axios from 'axios';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.fetchProjects = this.fetchProjects.bind(this);
        this.fetchNumberOfAgents = this.fetchNumberOfAgents.bind(this);
        this.state = {projects: [],agentCount : 0};
    }

    fetchProjects() {
        axios.get('/api/projects')
            .then((response) => {
                if (response.data) {
                    this.setState({projects: response.data});
                }
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
        this.fetchProjects();
        initDomHandlers();
    }

    render() {

        return (
            <Base agentCount={this.state.agentCount}>
                <div className="container">
                    <div className="columns" style={{margin: "1rem"}}>
                        <div className="column is-4">
                            <h5 className="title is-3">All Projects</h5>
                        </div>
                        <div className="column is-2 is-offset-6">
                            <Link to="/createproject" className="button is-success is-outlined">
                                Create New Project
                            </Link>
                        </div>
                    </div>
                    {this.state.projects.length? (<TreeView data={this.state.projects}/>) : null}
                </div>
            </Base>
        );
    }

}



