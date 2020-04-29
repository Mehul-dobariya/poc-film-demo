import React, { Component } from "react";
// import moment from "moment";
import axios from "axios";
import SweetAlert from 'react-bootstrap-sweetalert';
import { GridList, GridListTile, GridListTileBar, ListSubheader, IconButton } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
// import InfoIcon from '@material-ui/icons/Info';
import './custom.css';
import Rating from '@material-ui/lab/Rating';
import Header from './Header';
class Films extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filmList: [],
            sweetOpenError: false,
        }
    }
    async componentDidMount() {
        // Fetch list of films
        axios.get(`${process.env.REACT_APP_API_URL}films/films`)
            .then(async (response) => {
                if (response.data.success) {
                    await this.setState({ filmList: response.data.data });
                }
            }).catch(async (error) => {
                await this.setState({ sweetOpenError: true });
                // console.log("Err", error);
            });
    }
    // redirect to detail page on tile click
    handleClick = (e, film_data) => {
        e.preventDefault();
        console.log("film_data", film_data);
        this.props.history.push(`/films/detail/${film_data._id}/${film_data.name}`);
    }
    render() {
        return (
            <>
                <Header />
                <div style={{ width: "500px", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <GridList cellHeight={180} >
                        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
                            {/* <ListSubheader component="div">Films</ListSubheader> */}
                        </GridListTile>
                        {Object.keys(this.state.filmList).length > 0 && this.state.filmList.map((tile) => (
                            <GridListTile key={tile.photo} style={{ cursor: "pointer" }} onClick={(e) => this.handleClick(e, tile)}>
                                <img src={tile.photo} alt={tile.name} />
                                <GridListTileBar
                                    title={tile.name}
                                    subtitle={<Rating
                                        readOnly
                                        name="simple-controlled"
                                        value={tile.ratings}
                                    />}
                                // actionIcon={
                                //     <IconButton aria-label={`info about ${tile.title}`}>
                                //         <InfoIcon />
                                //     </IconButton>
                                // }
                                />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
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
export default withRouter(Films);