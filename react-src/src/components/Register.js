import React, { Component } from 'react';
import { TextField, Paper, Button} from '@material-ui/core';
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userEmail: '',
            userPassword: '',
            confirmPassword: '',
            sweetOpenSuccess: false,
            sweetOpenError: false,
            submitting: false,
            errors: {}
        }
    }
    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //User Name
        if (!this.state.userName) {
            formIsValid = false;
            errors["firstName"] = "Please enter first name";
        }

        //Email
        if (!this.state.userEmail) {
            formIsValid = false;
            errors["email"] = "Please enter mail";
        }
        if (typeof this.state["userEmail"] !== "undefined") {
            let lastAtPos = this.state["userEmail"].lastIndexOf('@');
            let lastDotPos = this.state["userEmail"].lastIndexOf('.');

            if (!(lastAtPos < lastDotPos && lastAtPos > 0 && this.state["userEmail"].indexOf('@@') === -1 && lastDotPos > 2 && (this.state["userEmail"].length - lastDotPos) > 2)) {
                formIsValid = false;
                errors["email"] = "Email is not valid";
            }
        }

        // Password
        if (this.state.userPassword && (this.state.userPassword !== this.state.confirmPassword)) {
            formIsValid = false;
            errors["confirmPassword"] = "Password dosen't match";
        }
        if (this.state.userPassword === this.state.confirmPassword) {
            errors["confirmPassword"] = "";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        await this.setState({ submitting: true });
        if (this.handleValidation()) {
            let data = {
                "name": this.state.userName,
                "email": this.state.userEmail,
                "password": this.state.userPassword
            }
            axios.post(`${process.env.REACT_APP_API_URL}users/register`, data)
                .then(async (response) => {
                    if (response.data.success) {
                        await this.setState({ sweetOpenSuccess: true, submitting: false });
                    } else {
                        await this.setState({ sweetOpenError: true, submitting: false });
                    }
                }).catch(async (error) => {
                    await this.setState({ sweetOpenError: true, submitting: false });
                    // console.log("Err", error);
                });
        }
        else {
            console.log("Validation Error");
            toast.error("Validation Error", {
                hideProgressBar: true,
                draggable: false,
                autoClose: 5000,
                position: toast.POSITION.BOTTOM_RIGHT
            });
            await this.setState({ submitting: false });
            // alert("Form has errors.")
        }
    }
    handleSignIn = (e) => {
        this.props.history.push("/signIn");
    }
    handleClick = () => {
        this.props.history.push("/films");
    }
    handleSuccess() {
        this.props.history.push(`/signIn`);
        this.setState({ sweetOpenSuccess: false });
    }
    handleError() {
        this.setState({ sweetOpenError: false });
    }
    render() {
        return (
            <>
                <div>
                    <Header/>
                </div>
                <div className="loginContent">
                    <Paper  >
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <div >
                                <label className="loginTitle" style={{ color: "#00004d" }}>Register </label>
                            </div>
                            <div className="loginContent">
                                <TextField style={{ marginBottom: "15px" }} label="Name" variant="outlined" onChange={(e) => this.setState({ userName: e.target.value })} />
                                <TextField style={{ marginBottom: "15px" }} label="Email" type="email" variant="outlined" onChange={(e) => this.setState({ userEmail: e.target.value })} />
                                <TextField className="textContent" label="Password" type="password" variant="outlined" onChange={(e) => this.setState({ userPassword: e.target.value })} />
                                <TextField className="textContent" label="Confirm Password" type="password" variant="outlined" onChange={(e) => this.setState({ confirmPassword: e.target.value })} />
                            </div>
                            <div className="submit">
                                <div>
                                    <label>Have an account ? </label>
                                    <Button
                                        color="primary"
                                        onClick={this.handleSignIn}
                                    >
                                        Sign In
                                    </Button>
                                </div>
                                <Button variant="contained" color="primary" type="submit" disabled={this.state.submitting}>
                                    Submit
                    </Button>

                            </div>
                        </form>
                    </Paper>

                </div>
                {this.state.sweetOpenSuccess && (
                    <SweetAlert
                        success
                        confirmBtnText="Continue"
                        confirmBtnBsStyle="success"
                        title="Registered Successfully"
                        onConfirm={this.handleSuccess.bind(this)}
                    >
                    </SweetAlert>
                )}
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
                <ToastContainer />
            </>
        )
    }
}
export default withRouter(Register);