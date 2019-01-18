import React from 'react';
import '../style.css';
import axios from 'axios';

/* 
    get this event id from hoc
    check if user user array contains this event id (on server)
    if so, make color green or yellow and highlight interested or going
*/

class DotOne extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "transparent",
            color: "lightgray"
        }
    }
    componentWillMount() {
        if (this.props.onOff) {
            this.setState(() => ({backgroundColor: "#FFC041", color: "white"}));
        }
    }
    render() {
        return (
            <div>
                <p
                className="event_button_interested"
                title="Let them know you're interested"
                style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}
                onClick={this.state.backgroundColor === "#FFC041" ? () => this.turnOff(this.props.eventId) : () => this.turnOn(this.props.eventId)}>
                Interested
                </p>
                <p
                className="event_button_interested_mobile"
                title="Let them know you're interested"
                style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}
                onClick={this.state.backgroundColor === "#FFC041" ? () => this.turnOff(this.props.eventId) : () => this.turnOn(this.props.eventId)}>
                I</p>
            </div>
        )
    }

    turnOn(eventId) {
        let data = {
            "eventId": eventId
        }
        axios.post('/interested', data).then(function(result) {
            console.log(result);
        })
        this.setState(() => ({backgroundColor: "#FFC041", color: "white"}));
    }
    turnOff(eventId) {
        let data = {
            "eventId": eventId
        }
        axios.post('/notInterested', data).then(function(result) {
            console.log(result);
        })
        this.setState(() => ({backgroundColor: "transparent", color: "lightgray"}));
    }
}

export default DotOne;