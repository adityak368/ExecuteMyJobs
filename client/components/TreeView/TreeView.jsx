'use strict';
import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './treeviewstyles.css';

export default class TreeView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('.tree').treegrid({
            'initialState': 'collapsed',
            'saveState': true,
        });
    }

    render() {
        let nodeCount = 0;
        const ui = this.props.data.map(function (project) {
            let result = [];
            result.push(<tr className={'treegrid-' + nodeCount}>
                <td><span style={{marginLeft:"10px"}}>{ project.name }</span></td>
                <td>Additional info</td>
                <td>
                    <Link to={`/createconfiguration?projectName=${project.name}`}>
                        <i className="fa fa-plus-square"></i>
                    </Link>
                </td>
            </tr>);
            let parentNodeId = nodeCount;
            nodeCount++;
            project.configurations.forEach(function (config) {
                result.push(<tr className={'treegrid-' + nodeCount + ' ' + 'treegrid-parent-' + parentNodeId}>
                    <td><Link to={`/configuration/${config.name}`}>{ config.name }</Link></td>
                    <td>Additional info</td>
                </tr>);
                nodeCount++;
            });
            return result;
        });
        return (

            <table className="tree treeview">
                <tbody>
                {ui}
                </tbody>
            </table>

        );
    }
}
