import React, { Component } from "react";
// import moment from "moment";
// import axios from "axios";
// import { withRouter } from 'react-router-dom';
import logo from '../logo.svg';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from 'react-router-dom';

class Films extends Component {
    constructor(props) {
        super(props);
        // this.state = {

        // }
    }
    async componentDidMount() {
        console.log("fiilms");

    }
    render() {
        return (
            <div className="App" id='root'>
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
            </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
            </a>
                </header>
            </div>
            // <div>
            //     <AppBar position="static">
            //         <Toolbar>
            //             <IconButton edge="start" color="inherit" aria-label="menu">
            //                 <MenuIcon />
            //             </IconButton>
            //             <Typography variant="h6">
            //                 News
            //     </Typography>
            //             <Button color="inherit">Login</Button>
            //         </Toolbar>
            //     </AppBar>
            // </div>
        )
    }
};
export default withRouter(Films);