import React, { Component } from "react";
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import './custom.css'
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            showAddFilm: true,
        }
    }
    async componentDidMount() {
        let data = JSON.parse(localStorage.getItem("userToken"))
        if (data != null && Object.keys(data.AuthToken).length > 0) {
            await this.setState({ isLoggedIn: true })
        }
        let url_data = window.location.href.split("/");
        if (url_data[url_data.length - 1] === "signIn" || url_data[url_data.length - 1] === "create" || url_data[url_data.length - 1] === "signUp") {
            this.setState({ showAddFilm: false })
        }

    }
    handleClick = () => {
        this.props.history.push("/films");
    }
    handleAuthClick = () => {
        this.props.history.push("/signIn");
    }
    handleAddFilmClick = () => {
        this.props.history.push("/films/create");
    }
    handleLogoutClick = async () => {
        localStorage.clear();
        await this.setState({ isLoggedIn: false })
    }
    render() {
        return (
            <div className="appBar">
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className="appBarTitle" onClick={this.handleClick}>
                            Films
                        </Typography>
                        {this.state.showAddFilm &&
                            <Button color="inherit" onClick={this.handleAddFilmClick}>Add Film</Button>
                        }
                        {this.state.isLoggedIn ?
                            <Button color="inherit" onClick={this.handleLogoutClick}>Logout</Button>
                            :
                            <Button color="inherit" onClick={this.handleAuthClick}>Sign In</Button>
                        }
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
};
export default withRouter(Header);