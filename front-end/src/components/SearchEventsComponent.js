import React from 'react';
import '../style.css';
import axios from 'axios';


class SearchEventsComponent extends React.Component {

    onSubmit = (e) => {
        e.preventDefault();
        let searchString = e.target.elements.searchBar.value;
        let data = { "searchString": searchString };
        axios.post('/searchEvents', data).then(function(response) {
            console.log('test');
            console.log(response);
        }).catch(function(err) {
            console.log("catch error: " + err);
        })
    }

    render() {
        return (
            <div className="last_section_container">
                <div className="create_event_component_container">
                    <h2>Filter Events</h2>
                    <div className="cec_form">
                        <form className="form" onSubmit={this.onSubmit}>
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
        )
    }

}

export default SearchEventsComponent;