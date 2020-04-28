import React, { Component } from "react";
// import moment from "moment";
// import axios from "axios";
import { withRouter } from 'react-router-dom';
import './custom.css';
import Header from './Header';
class Films extends Component {
    constructor(props) {
        super(props);
        this.state = {
         
        }
    }
    async componentDidMount() {
    
    }
    render() {
        return (
            <>
                <Header />FILMS</>
        )
    }
};
export default withRouter(Films);