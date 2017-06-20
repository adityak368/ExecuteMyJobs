import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import TreeView from 'components/TreeView';
import { handleError } from 'commons/errorhandler';
import { fetchNumberOfAgents, fetchProjects} from 'api/api';
import { Container, Grid, Header, Icon, Button } from 'semantic-ui-react';

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {projects: [],agentCount : 0};
    }

    componentDidMount() {
        fetchNumberOfAgents()
            .then((agentCount) => this.setState({agentCount}))
            .catch((error) => handleError(error));
        fetchProjects ()
            .then((projects) => this.setState({projects}))
            .catch((error) => handleError(error));
    }

    render() {

        return (
                <Container>
                    <Grid centered>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Header as='h2' icon textAlign='left'>
                                    All Projects
                                </Header>
                            </Grid.Column>
                            <Grid.Column >
                                <Link to={"/createproject"} className="ui green inverted button right floated">
                                    Create New Project
                                </Link>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    {this.state.projects.length? (<TreeView projects={this.state.projects}/>) : null}
                </Container>
        );
    }

}



