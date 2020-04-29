import React, { Component } from 'react';
import { TextField, Paper, Button, Grid, MenuItem, FormControl, InputLabel, OutlinedInput, InputAdornment, Box, Typography } from '@material-ui/core';
import axios from "axios";
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import CloseIcon from '@material-ui/icons/Close';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import DateFnsUtils from '@date-io/date-fns';
import 'date-fns';
import Rating from '@material-ui/lab/Rating';
import { Multiselect } from 'multiselect-react-dropdown';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
const countryChoice = [
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'US', label: 'United States', phone: '1' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'JP', label: 'Japan', phone: '81' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'IN', label: 'India', phone: '91' },
    { code: 'DE', label: 'Germany', phone: '49' },
    { code: 'CN', label: 'China', phone: '86' },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'AE', label: 'United Arab Emirates', phone: '971' },
    { code: 'AT', label: 'Austria', phone: '43' },
    { code: 'AU', label: 'Australia', phone: '61' },
    { code: 'FR', label: 'France', phone: '33' },
    { code: 'GB', label: 'United Kingdom', phone: '44' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
];

const genreOptions = [
    { id: 1, label: 'Horror' },
    { id: 2, label: 'Adventure' },
    { id: 3, label: 'Sci-Fi' },
    { id: 4, label: 'Comedy' },
    { id: 5, label: 'Action' },
    { id: 6, label: 'Documentary' },
    { id: 7, label: 'Thriller' },
    { id: 8, label: 'Romance' },
    { id: 9, label: 'Crime' },
    { id: 10, label: 'Animation' },
    { id: 11, label: 'Drama' },
];
class FilmsAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            fileToDisplay: null,
            filmName: '',
            filmDescription: '',
            filmReleaseDate: new Date(),
            filmRating: 0,
            filmTicketPrice: 0,
            countryOrigin: '',
            selectedFilmGenre: [],
            sweetOpenSuccess: false,
            sweetOpenError: false,
            submitting: false,
            errors: {},


        }
    }
    // Handle Validations
    handleValidation() {
        let errors = {};
        let formIsValid = true;

        //Film Name
        if (!this.state.filmName) {
            formIsValid = false;
            errors["filmName"] = "Please enter Film name";
        }
        //Film Description
        if (!this.state.filmDescription) {
            formIsValid = false;
            errors["filmDescription"] = "Please enter Film description";
        }
        //Film Origin
        if (!this.state.countryOrigin) {
            formIsValid = false;
            errors["countryOrigin"] = "Please enter Film origin";
        }
        //Film Genre
        if (Object.keys(this.state.selectedFilmGenre).length === 0) {
            formIsValid = false;
            errors["selectedFilmGenre"] = "Please enter Film genre";
        }
        this.setState({ errors: errors });
        return formIsValid;
    }
    handleSubmit = async (e) => {
        e.preventDefault();
        await this.setState({ submitting: true });
        if (this.handleValidation()) {
            let genre_array = [];
            this.state.selectedFilmGenre.map((genre) => {
                genre_array.push(genre.label)
            })
            // Creating FormData
            const formData = new FormData();
            if (this.state.file !== null && this.state.file !== '') {
                formData.append('filmPic', this.state.file);
            } else {
                formData.append('filmPic', '');
            }
            formData.append('name', this.state.filmName);
            formData.append('description', this.state.filmDescription);
            formData.append('releaseDate', moment(this.state.filmReleaseDate).toISOString());
            formData.append('ratings', this.state.filmRating);
            formData.append('ticketPrice', this.state.filmTicketPrice);
            formData.append('country', this.state.countryOrigin);
            formData.append('genre', genre_array);
            const options = {
                headers: { 'content-type': 'multipart/form-data' }
            };
            // Api call to add film
            axios.post(`${process.env.REACT_APP_API_URL}films/addFilms`, formData, options)
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
            // console.log("Validation Error");\
            // toast message on validation error
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
    // handle file change
    onChange = (event) => {
        this.setState({
            file: event.target.files[0],
            fileToDisplay: URL.createObjectURL(event.target.files[0])
        });
    }
    // remove selected file
    removeFile = (event) => {
        this.setState({
            file: null,
            fileToDisplay: null,
            imageBlank: true
        })
    }
    //** Handle Click events */
    handleSignIn = (e) => {
        this.props.history.push("/signIn");
    }
    handleClick = () => {
        this.props.history.push("/films");
    }
    handleSuccess() {
        this.props.history.push(`/films`);
        this.setState({ sweetOpenSuccess: false });
    }
    handleError() {
        this.setState({ sweetOpenError: false });
    }
    addDefaultSrc(ev) {
        ev.target.src = 'media/images/product_image_not_found.gif';
    }
    render() {
        return (
            <>
                <div>
                    <Header />
                </div>
                <div>
                    <Paper  >
                        <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                            <div >
                                <label className="loginTitle" style={{ color: "#00004d" }}>Add Film </label>
                            </div>
                            <div>
                                <Grid>
                                    <TextField style={{ marginBottom: "15px" }} label="Name" variant="outlined" onChange={(e) => this.setState({ filmName: e.target.value })} />
                                </Grid>
                                <Grid>
                                    <TextField style={{ marginBottom: "15px" }} multiline rows={2} rowsMax={5} label="Description" variant="outlined" onChange={(e) => this.setState({ filmDescription: e.target.value })} />
                                </Grid>
                                <Grid>
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
                                </Grid>
                                {/* :TODO Rating */}
                                <Grid>
                                    <Box component="fieldset" mb={3} borderColor="transparent">
                                        <Typography component="legend">Rating</Typography>
                                        <Rating
                                            name="simple-controlled"
                                            value={this.state.filmRating}
                                            onChange={(event, newValue) => {
                                                this.setState({ filmRating: newValue });
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid>
                                    <FormControl variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-amount">Ticket Price</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-amount"
                                            value={this.state.filmTicketPrice}
                                            onChange={(e) => this.setState({ filmTicketPrice: e.target.value })}
                                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                            labelWidth={85}
                                        />
                                    </FormControl>
                                </Grid>
                                {/* country selector */}
                                <Grid>
                                    <TextField
                                        id="stausUpdate"
                                        select
                                        style={{ width: "200px" }}
                                        margin="dense"
                                        label="Select Country"
                                        value={this.state.countryOrigin}
                                        onChange={(e) => this.setState({ countryOrigin: e.target.value })}
                                        helperText=""
                                        variant="outlined"
                                    >
                                        {countryChoice.map(option => (
                                            <MenuItem key={option.label} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                {/* Genre */}
                                <Multiselect
                                    options={genreOptions} // Options to display in the dropdown
                                    selectedValues={this.state.selectedFilmGenre} // Preselected value to persist in dropdown
                                    onSelect={(e) => this.setState({ selectedFilmGenre: e })} // Function will trigger on select event
                                    onRemove={(e) => this.setState({ selectedFilmGenre: e })} // Function will trigger on remove event
                                    displayValue="label" // Property name to display in the dropdown options
                                />
                                <Grid>
                                    <label>Upload a Photo</label>
                                </Grid>
                                <Grid>
                                    <input className="choose-file-input w-100" name="filmPic" type="file" accept="image/*" onChange={this.onChange} />
                                </Grid>
                                <Grid>
                                    <img style={{ maxWidth: "60px" }} src={this.state.fileToDisplay} onError={this.addDefaultSrc} alt="No Preview Available" />
                                    {(this.state.fileToDisplay) &&
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
                {/* Display Alert on Success */}
                {this.state.sweetOpenSuccess && (
                    <SweetAlert
                        success
                        confirmBtnText="Continue"
                        confirmBtnBsStyle="success"
                        title="Film Added Successfully"
                        onConfirm={this.handleSuccess.bind(this)}
                    >
                    </SweetAlert>
                )}
                {/* Display Alert on Error */}
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