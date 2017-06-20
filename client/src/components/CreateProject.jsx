import React, {Component} from 'react';
import axios from 'axios';
import { Button, Form, Header, Icon, Container, Input } from 'semantic-ui-react';

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
            <Container>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='newspaper' circular />
                    <Header.Content>
                        Create New Project
                    </Header.Content>
                </Header>
                <Form>
                    <Form.Field>
                        <label>Project Name</label>
                        <Input icon='signup' iconPosition='left' id="project_name" className="input" type="text" placeholder="Project Name"
                               value={this.state.name} onChange={this.handleChangeName}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Project Description</label>
                        <Input icon='book' iconPosition='left' id="project_name" className="input" type="text" placeholder="Description"
                               value={this.state.description} onChange={this.handleChangeDescription} />
                    </Form.Field>
                    <Button onClick={this.createNewProject} inverted color='green' floated="right">Create</Button>
                </Form>
            </Container>
        );
    }

}



