import React, {Component} from 'react';
import Navbar from './Navbar';

export default class Base extends Component {

    render() {
        return (
            <div id="content">

                <Navbar {...this.props}/>

                {this.props.children}

            </div>
        );
    }

}
