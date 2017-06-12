import React, {Component} from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Base from './Base';

export default class CreateConfiguration extends Component {

    constructor(props) {
        super(props);
        this.createNewConfiguration = this.createNewConfiguration.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.state = {name: '', description: ''};
    }

    createNewConfiguration(e) {
        e.preventDefault();
        const queryParms = queryString.parse(this.props.location.search);
        if (queryParms.projectName) {
            axios.post('/api/configurations', {
                projectname: queryParms.projectName,
                name: this.state.name,
                description: this.state.description
            })
                .then((response) => {
                    this.setState({name: '', description: ''});
                    this.props.history.push('/');
                })
                .catch((error) => {
                    toastr.error(error.response.data.message, 'Error');
                });
        } else {
            toastr.error('Invalid Project!', 'Error');
        }

    }

    handleChangeName(e) {
        this.setState({name: e.target.value});
    }

    handleChangeDescription(e) {
        this.setState({description: e.target.value});
    }

    render() {
        return (
            <Base>
                <div className="container" style={{padding: "2rem"}}>
                    <h3 className="title is-1"> Create a new configuration </h3>
                    <form id="project_form" onSubmit={this.createNewConfiguration}>
                        <div className="field">
                            <label className="label">Configuration Name</label>
                            <p className="control has-icons-left">
                                <input id="project_name" className="input" type="text" placeholder="Configuration Name"
                                       value={this.state.name} onChange={this.handleChangeName}/>
                                <span className="icon is-small is-left">
                                  <i className="fa fa-id-card"></i>
                                </span>
                            </p>
                        </div>
                        <div className="field">
                            <label className="label">Description</label>
                            <p className="control has-icons-left">
                                <input id="project_name" className="input" type="text" placeholder="Description"
                                       value={this.state.description} onChange={this.handleChangeDescription}/>
                                <span className="icon is-small is-left">
                                      <i className="fa fa-book"></i>
                                    </span>
                            </p>
                        </div>
                        <button type="submit" className="button is-success is-outlined">Create</button>
                    </form>
                </div>
            </Base>
        );
    }

}



