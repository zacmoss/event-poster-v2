import React from 'react';
import '../style.css';
import EventFeed from './EventFeed';
import axios from 'axios';
import Header from './Header';
import CreateEventComponent from './CreateEventComponent';
import SearchEventsComponent from './SearchEventsComponent';
import SearchResultsPage from './SearchResultsPage';
//import { Link } from 'react-router-dom';


class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchComponent: true,
            cec: false,
            eventFeed: true,
            searchResults: false,
            array: undefined
        }
        this.searchEvents = this.searchEvents.bind(this);
    }

    
    componentDidMount() {
        /*
        console.log('rendered');
        axios.get('/testGet').then(function(result) {
            console.log(result.data);
        }).catch(function(err) {
            console.log("error: " + err);
        })
        */
    }
    

    render() {
        return (
            <div>
                <Header />
                <div>
                    <EventFeed />
                </div>
            </div>
        )
    }

    /* old render
    render() {
        return (
            <div>
                <Header />
                <div className="home_page_container">
                    {this.state.searchComponent &&
                    <div className="last_section_container">
                        <div className="create_event_component_container">
                            <h2>Filter Events</h2>
                            <div className="cec_form">
                                <form className="form" onSubmit={this.searchEvents}>
                                    <div className="cec_form_inputs_container">
                                        <div>
                                            <div><label>Search Events</label></div>
                                            <input className="longInput" name="searchBar" placeholder="Search Events" autoComplete="off" required></input>
                                        </div>
                                        <div className="form_button_container">
                                            <button>Search</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    }
                    {this.state.eventFeed && <EventFeed />}
                    {this.state.searchResults && <SearchResultsPage array={this.state.array} />}
                    {this.state.cec && <CreateEventComponent />}
                </div>
            </div>
        )
    }
    */

    
    searchEvents(e) {
        e.preventDefault();
        let self = this;
        let searchString = e.target.elements.searchBar.value;
        let data = { "searchString": searchString };
        axios.post('/searchEvents', data).then(function(response) {
            console.log(response);
            // response is the array of events returned
            self.setState(() => ({ eventFeed: false, searchResults: true, array: response.data }));
            // save this to array
        }).catch(function(err) {
            console.log("catch error: " + err);
        })
    }
    
}

export default HomePage;