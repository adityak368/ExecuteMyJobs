import React, {Component} from 'react';
import Base from './Base';
import { initDomHandlers } from 'commons/domutils';

import '../styles/commons.css';

export default class NotFound extends Component {

    componentDidMount() {
        initDomHandlers();

    }
    render() {
        return (
            <Base>
                <div className="center-div has-text-centered">
                    <span className="icon is-large">
                      <i className="fa fa-frown-o"></i>
                    </span>
                    <h1 className="title is-1"> {this.props.msg}</h1>
                </div>
            </Base>);
    }

}
