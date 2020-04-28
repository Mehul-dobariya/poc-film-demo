import React, { Component } from 'react';
import { TextField, Paper, Button, Grid, FormControl, InputLabel, OutlinedInput, InputAdornment, Box, Typography } from '@material-ui/core';
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import CountryPicker from './CountryPicker';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Rating from '@material-ui/lab/Rating';
import { Multiselect } from 'multiselect-react-dropdown';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
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
class FilmsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileToDisplay: null,
            userName: '',
            userEmail: '',
            userPassword: '',
            confirmPassword: '',
            sweetOpenSuccess: false,
            sweetOpenError: false,
            submitting: false,
            errors: {},
            filmReleaseDate: new Date(),
            filmRating: 0

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
    onChange = (event) => {
        this.setState({
            file: event.target.files[0],
            fileToDisplay: URL.createObjectURL(event.target.files[0])
        });
    }
    removeFile = (event) => {
        this.setState({
            file: null,
            fileToDisplay: null,
            imageBlank: true
        })
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
    addDefaultSrc(ev) {
        ev.target.src = 'media/images/no_preview.jpg';
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
                            <div >
                                <label className="loginTitle" style={{ color: "#00004d" }}>Add Film </label>
                            </div>
                            <div className="loginContent">
                                <TextField style={{ marginBottom: "15px" }} label="Name" variant="outlined" onChange={(e) => this.setState({ userName: e.target.value })} />
                                <TextField style={{ marginBottom: "15px" }} multiline rowsMax={4} label="Description" variant="outlined" onChange={(e) => this.setState({ userEmail: e.target.value })} />
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <Grid container justify="space-around">
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd/MM/yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            placeholder="Select Date"
                                            value={this.state.filmReleaseDate}
                                            onChange={(date) => this.setState({ filmReleaseDate: date })}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date',
                                            }}
                                        /></Grid>
                                </MuiPickersUtilsProvider>
                                {/* :TODO Rating */}
                                <Box component="fieldset" mb={3} borderColor="transparent">
                                    <Typography component="legend">Controlled</Typography>
                                    <Rating
                                        name="simple-controlled"
                                        // value={value}
                                        onChange={(event, newValue) => {
                                            this.setState({ filmRating: newValue });
                                        }}
                                    />
                                </Box>
                                <FormControl variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-amount">Ticket Price</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-amount"
                                        // value={values.amount}
                                        // onChange={handleChange('amount')}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        labelWidth={85}
                                    />
                                </FormControl>
                                {/* country selector */}
                                <CountryPicker />
                                {/* Genre */}
                                <Multiselect
                                    options={this.state.payorNameData} // Options to display in the dropdown
                                    selectedValues={this.state.selectedPayorName} // Preselected value to persist in dropdown
                                    onSelect={(e) => this.setState({ selectedPayorName: e })} // Function will trigger on select event
                                    onRemove={(e) => this.setState({ selectedPayorName: e })} // Function will trigger on remove event
                                    displayValue="value" // Property name to display in the dropdown options
                                />
                                <Grid>
                                    <label>Upload a Photo</label>
                                </Grid>
                                <Grid>
                                    <input className="choose-file-input w-100" type="file" onChange={this.onChange} />
                                </Grid>
                                <Grid item md={2} lg={4} className="image-preview">
                                    <img style={{ maxWidth: "60px" }} src={this.state.fileToDisplay} onError={this.addDefaultSrc} />
                                    {(this.state.pic || this.state.fileToDisplay) &&
                                        <CloseIcon onClick={this.removeFile} />
                                    }
                                </Grid>
                            </div>
                            <div className="submit">
                                <div>
                                    <Button
                                        color="primary"
                                        onClick={this.handleCancle}
                                    >
                                        Cancel
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
                        title="Role created Successfully"
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
export default withRouter(FilmsAdd);