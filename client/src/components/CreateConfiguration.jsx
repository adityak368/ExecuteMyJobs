import React, {Component} from 'react'
import axios from 'axios'
import queryString from 'query-string'
import { Button, Form, Header, Icon, Container, Input } from 'semantic-ui-react'
import { handleError } from 'commons/errorhandler'
import { createNewConfiguration } from 'api/api'

import autobind from 'autobind-decorator'

export default class CreateConfiguration extends Component {

    constructor(props) {
        super(props)
        this.createNewConfiguration = this.createNewConfiguration.bind(this)
        //this.handleChangeName = this.handleChangeName.bind(this)
        this.handleChangeDescription = this.handleChangeDescription.bind(this)
        this.state = {name: '', description: ''}
    }

    createNewConfiguration(e) {
        e.preventDefault()
        const queryParms = queryString.parse(this.props.location.search)
        if (queryParms.project) {
            createNewConfiguration({
                projectname: queryParms.project,
                name: this.state.name,
                description: this.state.description
            }).then((response) => {
                toastr.success(`Created New Configuration ${this.state.name}!`, 'Success')
                this.setState({name: '', description: ''})
                this.props.history.push('/')
            }).catch((error) => handleError(error))

        } else {
            toastr.error('Invalid Project!', 'Error')
        }

    }

    @autobind
    handleChangeName(e) {
        this.setState({name: e.target.value})
    }

    handleChangeDescription(e) {
        this.setState({description: e.target.value})
    }

    render() {
        return (
            <Container>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='newspaper' circular/>
                    <Header.Content>
                        Create New Configuration
                    </Header.Content>
                </Header>
                <Form>
                    <Form.Field>
                        <label>Configuration Name</label>
                        <Input icon='signup' iconPosition='left' id="project_name" className="input" type="text" placeholder="Configuration Name"
                            value={this.state.name} onChange={this.handleChangeName}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Configuration Description</label>
                        <Input icon='book' iconPosition='left' id="project_name" className="input" type="text" placeholder="Description"
                            value={this.state.description} onChange={this.handleChangeDescription}/>
                    </Form.Field>
                    <Button onClick={this.createNewConfiguration} inverted color='green' floated="right">Create</Button>
                </Form>
            </Container>
        )
    }

}



