import React from 'react';
import '../style.css';
import axios from 'axios';

// Need to redirect to Event Feed or clear inputs after submit

class CreateEventComponent extends React.Component {

    state = {
        dateString: undefined
    }
    
    componentWillMount() {
        let today = new Date();
        let x = today.toString();
        let array = x.split(" ");
        let month = array[1];
        let day = array[2];
        let year = array[3];
        switch (month) {
            case "Jan":
                month = "01";
                break;
            case "Feb":
                month = "02";
                break;
            case "Mar":
                month = "03";
                break;
            case "Apr":
                month = "04";
                break;
            case "May":
                month = "05";
                break;
            case "Jun":
                month = "06";
                break;
            case "Jul":
                month = "07";
                break;
            case "Aug":
                month = "08";
                break;
            case "Sep":
                month = "09";
                break;
            case "Oct":
                month = "10";
                break;
            case "Nov":
                month = "11";
                break;
            case "Dec":
                month = "12";
                break;
            default:
                break;
        }
        let dateString = year + "-" + month + "-" + day;
        this.setState(() => ({ dateString: dateString }));
    }

    onSubmit = (e) => {
        e.preventDefault();

        let title = e.target.elements.title.value;
        let location = e.target.elements.location.value;
        let time = e.target.elements.time.value;
        let date = e.target.elements.date.value;
        let description = e.target.elements.description.value;

        // input sanitization

        // just display title with ... if beyond a certain length
        //date = date.toString();
        //alert(date);
        let data = {
            "title": title,
            "location": location,
            "time": time,
            "date": date,
            "description": description
        }

        axios.post('/createEvent', data).then(function(response) {
            console.log("response: " + response.data);
            /*alert(response.data.title);*/
            /*self.props.history.push('/');*/
            window.location.reload(true);
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }
    

    render() {
        return (
            <div className="last_section_container">
                <div className="create_event_component_container">
                    
                    <h2>Create Event</h2>
                    <div className="cec_form">
                        
                        <form className="form" onSubmit={this.onSubmit}>
                            <div className="cec_form_inputs_container">
                                <div>
                                    <div><label>Title</label></div>
                                    <input className="longInput" name="title" placeholder="Enter a title" autoComplete="off" maxLength="40" required></input>
                                </div>
                                <div>
                                    <div><label>Location</label></div>
                                    <input className="longInput" name="location" placeholder="Enter a location" autoComplete="off" maxLength="100" required></input>
                                </div>
                                <div className="row">
                                    <div>
                                    <div><label>Time</label></div>
                                    <select className="timeInput" name="time" autoComplete="off" required>
                                        <option value="1:00am">1:00am</option>
                                        <option value="2:00am">2:00am</option>
                                        <option value="3:00am">3:00am</option>
                                        <option value="4:00am">4:00am</option>
                                        <option value="5:00am">5:00am</option>
                                        <option value="6:00am">6:00am</option>
                                        <option value="7:00am">7:00am</option>
                                        <option value="8:00am">8:00am</option>
                                        <option value="9:00am">9:00am</option>
                                        <option value="10:00am">10:00am</option>
                                        <option value="11:00am">11:00am</option>
                                        <option value="12:00pm">12:00pm</option>
                                        <option value="1:00pm">1:00pm</option>
                                        <option value="2:00pm">2:00pm</option>
                                        <option value="3:00pm">3:00pm</option>
                                        <option value="4:00pm">4:00pm</option>
                                        <option value="5:00pm">5:00pm</option>
                                        <option value="6:00pm">6:00pm</option>
                                        <option value="7:00pm">7:00pm</option>
                                        <option value="8:00pm">8:00pm</option>
                                        <option value="9:00pm">9:00pm</option>
                                        <option value="10:00pm">10:00pm</option>
                                        <option value="11:00pm">11:00pm</option>
                                        <option value="12:00am">12:00am</option>
                                    </select>
                                    </div>
                                    <div>
                                    <div><label>Date</label></div>
                                    <input className="dateInput" type="date" name="date" min={this.state.dateString} autoComplete="off" required></input>
                                    </div>
                                </div>
                                <div>
                                    <div><label>Description</label></div>
                                    <textarea className="shortInput" style={{width: "250px", border: "1px lightgray solid"}} name="description" placeholder="Description" autoComplete="off" maxLength="1000" required></textarea>
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

export default CreateEventComponent;