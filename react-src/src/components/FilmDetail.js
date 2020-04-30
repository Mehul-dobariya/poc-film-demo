import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import { Grid, Button, TextField } from '@material-ui/core';
import SweetAlert from 'react-bootstrap-sweetalert';
import { withRouter } from 'react-router-dom';
import './custom.css';
import Header from './Header';
class FilmDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filmData: {},
            sweetOpenError: false,
            sweetOpenSuccess: false,
            isLoggedIn: false,
            commentText: '',
            authToken: '',
            userData: {},
            filmId: ''
        }
    }
    async componentDidMount() {
        let data = JSON.parse(localStorage.getItem("userToken"))
        let userData = JSON.parse(localStorage.getItem("userData"))
        if (data != null && Object.keys(data.AuthToken).length > 0) {
            await this.setState({ isLoggedIn: true, authToken: data.AuthToken, userData: userData.user })
        }
        let id = window.location.href.split("/");
        // Fetch Data of particular film
        axios.get(`${process.env.REACT_APP_API_URL}films/film/detail?id=${id[id.length - 2]}`)
            .then(async (response) => {
                if (response.data.success) {
                    await this.setState({ filmData: response.data.data, filmId: id[id.length - 2] });
                }
            }).catch(async (error) => {
                // console.log("Err", error);
                await this.setState({ sweetOpenError: true });
            });
    }
    // display default image
    addDefaultSrc(ev) {
        ev.target.src = 'media/images/product_image_not_found.gif';
    }
    handleAddComment = async (e) => {
        e.preventDefault();
        await this.setState({ submitting: true });
        let data = {
            id: this.state.filmId,
            text: this.state.commentText,
            user: this.state.userData
        }
        // Api call to add comment
        if (this.state.authToken) {
            const options = {
                headers: { 'Content-Type': "application/json", 'Authorization': `Bearer ${this.state.authToken}` }
            };
            axios.post(`${process.env.REACT_APP_API_URL}films/addComment`, data, options)
                .then(async (response) => {
                    if (response.data.success) {
                        await this.setState({ commentText: '', filmData: response.data.data, sweetOpenSuccess: true, submitting: false });
                    } else {
                        await this.setState({ sweetOpenError: true, submitting: false });
                    }
                }).catch(async (error) => {
                    await this.setState({ sweetOpenError: true, submitting: false });
                    // console.log("Err", error);
                });
        } else {
            await this.setState({ submitting: false });
        }
    }
    handleSuccess() {
        this.setState({ sweetOpenSuccess: false });
    }
    handleError() {
        this.setState({ sweetOpenError: false });
    }
    render() {
        let comments = [];
        if (this.state.filmData.comments !== undefined && this.state.filmData.comments !== null && this.state.filmData.comments) {
            for (const [index, value] of this.state.filmData.comments.entries()) {
                if (value !== '')
                    comments.push(<div className="comment">
                        <div >{value.text}</div>
                        <label style={{ color: "darkgray",display:"flex",justifyContent:"flex-end" }}>Posted By: {value.author.email}</label>
                    </div>)
            }
        }
        return (
            <>
                <Header />
                <div style={{ marginTop: "20px", marginLeft: "20px" }}>
                    <div>
                        <img style={{ maxWidth: "300px" }} src={this.state.filmData.photo} onError={this.addDefaultSrc} alt="No Preview Available" />
                    </div>
                    <div>
                        <Grid><label>Film Name:</label> <label>{this.state.filmData.name}</label></Grid>
                        <Grid><label>Description:</label> <label>{this.state.filmData.description}</label></Grid>
                        <Grid><label>Release Date:</label> <label>{moment(`${this.state.filmData.releaseDate}`).format("DD/MM/YYYY")}</label></Grid>
                        <Grid><label>Ratings</label> <label>{this.state.filmData.ratings}/5</label></Grid>
                        <Grid><label>Ticket Price</label> <label>$ {this.state.filmData.ticketPrice}</label></Grid>
                        <Grid><label>Origin:</label> <label>{this.state.filmData.country}</label></Grid>
                    </div>
                    <div className="commentContainer">
                        <label style={{ marginLeft: "5px", marginTop: "2px" }}>Comments:</label>
                        {Object.keys(comments).length > 0 ?
                            comments
                            : <div><label style={{ marginLeft: "5px" }}>No Comments</label></div>
                        }
                    </div>
                    <div style={{ marginTop: "15px" }}>
                        <Grid>
                            <TextField style={{ marginBottom: "15px", width: "40%" }} disabled={!this.state.isLoggedIn} multiline rows={2} rowsMax={5} placeholder="Type comment here.." variant="outlined" onChange={(e) => this.setState({ commentText: e.target.value })} />
                        </Grid>
                        <Button variant="outlined" disabled={!this.state.isLoggedIn} onClick={this.handleAddComment}>Add Comment</Button>
                        {!this.state.isLoggedIn &&
                            <div>
                                <label style={{ color: "red", marginTop: "3px" }}>To add comment you need to be logged in</label>
                            </div>
                        }
                    </div>
                </div>
                {/* Display Alert on Success */}
                {this.state.sweetOpenSuccess && (
                    <SweetAlert
                        success
                        confirmBtnText="Continue"
                        confirmBtnBsStyle="success"
                        title="Comment added Successfully"
                        onConfirm={this.handleSuccess.bind(this)}
                    >
                    </SweetAlert>
                )}
                {/* Display Alert on Error */}
                {
                    this.state.sweetOpenError && (
                        <SweetAlert
                            error
                            confirmBtnText="Continue"
                            confirmBtnBsStyle="danger"
                            title="Oops!, Something went Wrong"
                            onConfirm={this.handleError.bind(this)}
                        >
                        </SweetAlert>
                    )
                }
            </>
        )
    }
};
export default withRouter(FilmDetail);