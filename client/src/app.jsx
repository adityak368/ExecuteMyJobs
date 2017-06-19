import React, {Component} from 'react'
import {BrowserRouter} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import Base from 'components/Base';

export default class App extends Component {
  render() {
        return (<BrowserRouter>
                    <Base/>
                </BrowserRouter>);
  }
}
