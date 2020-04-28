import React, { Component } from 'react';
import { TextField, Paper, Button } from '@material-ui/core';
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import Header from './Header';
// const useStyles = makeStyles((theme) => ({
//     root: {
//         '& > *': {
//             margin: theme.spacing(3),
//             width: '35ch',
//         },
//     },
// }));
// const usePaperStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         flexWrap: 'wrap',
//         '& > *': {
//             margin: theme.spacing(10),
//             width: theme.spacing(75),
//             height: theme.spacing(60),
//         },
//     },
// }));
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            sweetOpenSuccess: false,
            sweetOpenError: false,
            submitting: false,
        }
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        await this.setState({ submitting: true });
        axios.post(`${process.env.REACT_APP_API_URL}users/authenticate`, { email: this.state.email, password: this.state.password })
            .then(async (response) => {
                if (response.data.success) {
                    localStorage.setItem("userToken", JSON.stringify({ "AuthToken": response.data.token }));
                    localStorage.setItem("userData", JSON.stringify({ "user": response.data.user }));
                    this.props.history.push("/films");
                } else {
                    await this.setState({ sweetOpenError: true, submitting: false });
                }
            }).catch(async (error) => {
                await this.setState({ sweetOpenError: true, submitting: false });
                // console.log("Err", error);
            });
    }
    handleSignUp = (e) => {
        this.props.history.push("/signUp");
    }
    handleClick = () => {
        this.props.history.push("/films");
    }
    handleError() {
        this.setState({ sweetOpenError: false });
    }
    render() {
        return (
            <>
                <div>
                    <Header />
                </div>
                <div className="loginContent">
                    <Paper  >
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <div>
                                <label className="loginTitle" style={{ color: "#00004d" }}>Login</label>
                            </div>
                            <div >
                                <TextField style={{ marginBottom: "15px" }} label="Email" variant="outlined" onChange={(e) => this.setState({ email: e.target.value })} />
                                <TextField className="textContent" label="Password" type="password" variant="outlined" onChange={(e) => this.setState({ password: e.target.value })} />
                            </div>
                            <div className="submit">
                                <div>
                                    <label>Don't have an account yet? </label>
                                    <Button
                                        color="primary"
                                        onClick={this.handleSignUp}
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                                <Button variant="contained" color="primary" type="submit" disabled={this.state.submitting}>
                                    Submit
                    </Button>

                            </div>
                        </form>
                    </Paper>
                </div>
                {this.state.sweetOpenError && (
                    <SweetAlert
                        error
                        confirmBtnText="Continue"
                        confirmBtnBsStyle="danger"
                        title="Oops!, Something went Wrong"
                        onConfirm={this.handleError.bind(this)}
                    >
                    </SweetAlert>
                )}
            </>
        )
    }
}
export default withRouter(Login);