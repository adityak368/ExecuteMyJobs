import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import TreeView from 'components/TreeView'
import { handleError } from 'commons/errorhandler'
import { fetchProjects} from 'api/api'
import { Container, Grid, Header} from 'semantic-ui-react'

import {observer, PropTypes as MobxPropTypes} from 'mobx-react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'

@observer
export default class Home extends Component {

    componentDidMount() {
        this.loadProjects()
    }

    @autobind
    loadProjects() {
        const store = this.props.store
        fetchProjects ()
            .then((projects) => store.projects = projects)
            .catch((error) => handleError(error))
    }

    render() {
        const store = this.props.store
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
                            <Link to={'/createproject'} className="ui green inverted button right floated">
                                    Create New Project
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <TreeView projects={store.projects} {...this.props} loadProjects={this.loadProjects} />
            </Container>
        )
    }

}

Home.propTypes = {
    store : PropTypes.shape({
        allProjects: MobxPropTypes.observableArray.isRequired,
    })
}

Home.defaultProps = {
    store :{
        allProjects: []
    }
}

