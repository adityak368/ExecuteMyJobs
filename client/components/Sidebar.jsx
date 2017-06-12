import React, {Component} from 'react';
import { withRouter } from 'react-router-dom'
import axios from 'axios';

export default class Sidebar extends Component {

    constructor(props) {
        super(props);
    }


    componentDidMount() {
        $(function(){
            $('.sidebar2').on('click', 'li', function(){
                if (!$(this).hasClass('active')) {
                    $('.sidebar2 li').removeClass('active');
                    $(this).addClass('active');
                }
            })
        });
    }

    render() {
        return (
                <ul className="sidebar2 dark">
                    <li className="active"><a href="#"><span className="mif-home icon"></span>Dashboard</a></li>
                    <li><a href="#"><span className="mif-cog icon"></span>Layouts</a></li>
                    <li><a href="#">Thread item</a></li>
                    <li><a href="#">Disabled item</a></li>
                </ul>
        );
    }

}



