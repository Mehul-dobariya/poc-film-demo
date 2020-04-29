import React, { Component } from "react";
import moment from "moment";
import axios from "axios";
import { Grid, Button } from '@material-ui/core';
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
        }
    }
    async componentDidMount() {
        let id = window.location.href.split("/");
        // Fetch Data of particular film
        axios.get(`${process.env.REACT_APP_API_URL}films/film/detail?id=${id[id.length - 2]}`)
            .then(async (response) => {
                if (response.data.success) {
                    await this.setState({ filmData: response.data.data });
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
    render() {
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
                    <div style={{ marginTop: "15px" }}>
                        <Button variant="outlined">Add Comment</Button>
                    </div>
                    {/* <div style={{ marginTop: "15px" }}>
                        {Object.keys(this.state.filmData.comments).length > 0 ?
                            this.state.filmData.comments.map((comment) => {
                                <div>{comment}</div>
                            })
                            : <div>No Comments</div>
                        }
                    </div> */}
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