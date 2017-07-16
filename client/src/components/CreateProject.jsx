import React, {Component} from 'react'
import axios from 'axios'
import { Button, Form, Header, Icon, Container, Input } from 'semantic-ui-react'
import { handleError } from 'commons/errorhandler'
import { createNewProject } from 'api/api'

import autobind from 'autobind-decorator'

export default class CreateProject extends Component {

    state = {name: '', description: ''}
    
    @autobind
    createNewProject(e) {
        e.preventDefault()
        createNewProject({
            name: this.state.name,
            description: this.state.description
        }).then((response) => {
            toastr.success(`Created New Project ${this.state.name}!`, 'Success')
            this.setState({name: '', description: ''})
            this.props.history.push('/')
        }).catch((error) => handleError(error))
    }

    @autobind
    handleChangeName(e) {
        this.setState({name: e.target.value})
    }

    @autobind
    handleChangeDescription(e) {
        this.setState({description: e.target.value})
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
        )
    }

}



