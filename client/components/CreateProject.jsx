import React, {Component} from 'react';
import Base from './Base';
import axios from 'axios';

export default class CreateProject extends Component {

    constructor(props) {
        super(props);
        this.createNewProject = this.createNewProject.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
        this.state = {name: '', description: ''};
    }

    createNewProject(e) {
        e.preventDefault();
        axios.post('/api/projects', {
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
                    <h3 className="title is-1"> Create a new project </h3>
                    <form id="project_form" onSubmit={this.createNewProject}>
                        <div className="field">
                            <label className="label">Project Name</label>
                            <p className="control has-icons-left">
                                <input id="project_name" className="input" type="text" placeholder="Project Name"
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



