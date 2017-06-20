'use strict';
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon,Accordion,Message, Header, List,Popup,Grid,Button,Table,Input,Label } from 'semantic-ui-react';

export default class TreeView extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {projects: []};
    // }
    render() {
        const projects = this.props.projects.map((project) => {
            const configurations = project.configurations.map( (config) => {
                return ({
                    key: config._id,
                    title: <Label color='brown' content={ config.name }/>,
                    content: (
                            <Header as='h4'>
                                <Icon name='options'/>
                                <Header.Content>
                                    {config.name}
                                    <Header.Subheader>
                                        {config.description}
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                    ),
                });
            });

            return ({
                key: project._id,
                title: <Label color='blue' content={ project.name }/>,
                content: (
                    <div>
                        <Header as='h2'>
                            <Icon name='cube'/>
                            <Header.Content>
                                { project.name }
                                <Header.Subheader>
                                    {project.description}
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                        <Message>
                            { project.description }
                        </Message>
                        { !project.configurations.length ?
                            <NotFound msg="No Configurations Added!" isCenterOfPage={false}/> : null }

                        { project.configurations.length ? <div className="margin-1rem">
                            <Header>Configurations</Header>
                            <Accordion panels={configurations} exclusive={false} fluid styled/>
                        </div> : null }
                    </div>
                ),
            });
        });
        return (

            <Container>
                {!this.props.projects.length ? <NotFound msg="No Projects Added!"/> : null}

                {this.props.projects.length ? <Accordion panels={projects} exclusive={false} fluid styled/> : null}

            </Container>

        );
    }
}
