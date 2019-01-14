import React from 'react';
import '../style.css';
import axios from 'axios';
import Header from './Header';


// Need to redirect to Event Feed or clear inputs after submit

class CreateEventPage extends React.Component {

    onSubmit = (e) => {
        e.preventDefault();

        let title = e.target.elements.title.value;
        let location = e.target.elements.location.value;
        let description = e.target.elements.description.value;

        let data = {
            "title": title,
            "location": location,
            "description": description
        }

        let self = this;
        axios.post('/createEvent', data).then(function(response) {
            console.log("response: " + response.data);
            alert(response.data.title);
            self.props.history.push('/');
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }
    

    render() {
        return (
            <div>
                <Header />
                
                
                <div className="form_page_container">
                    <div className="form_container">
                        <h2>Create Event</h2>
                        <form className="form" onSubmit={this.onSubmit}>
                            <div className="form_inputs_container">
                                <div>
                                    <div><label>Title</label></div>
                                    <input name="title" placeholder="Enter a title" autoComplete="off"></input>
                                </div>
                                <div>
                                    <div><label>Location</label></div>
                                    <input name="location" placeholder="Enter a location" autoComplete="off"></input>
                                </div>
                                <div>
                                    <div><label>Description</label></div>
                                    <textarea name="description" placeholder="Description" autoComplete="off"></textarea>
                                </div>
                                <div className="form_button_container">
                                    <button>Submit</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateEventPage;