import React from 'react';
import '../style.css';
import axios from 'axios';

class DotTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: "transparent",
            color: "lightgray"
        }
    }
    componentWillMount() {
        if (this.props.onOff) {
            this.setState(() => ({backgroundColor: "#2BA745", color: "white"}));
        }
    }
    render() {
        return (
            <div>
                <p className="event_button_going"
                title="Plan to go"
                style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}
                onClick={this.state.backgroundColor === "#2BA745" ? () => this.turnOff(this.props.eventId) : () => this.turnOn(this.props.eventId)}>
                Going</p>
                <p className="event_button_going_mobile"
                title="Plan to go"
                style={{backgroundColor: this.state.backgroundColor, color: this.state.color}}
                onClick={this.state.backgroundColor === "#2BA745" ? () => this.turnOff(this.props.eventId) : () => this.turnOn(this.props.eventId)}>
                G</p>
            </div>
        )
    }

    turnOn(eventId) {
        let data = {
            "eventId": eventId
        }
        axios.post('/going', data).then(function(result) {
            console.log(result);
        })
        this.setState(() => ({backgroundColor: "#2BA745", color: "white"}));
    }
    turnOff(eventId) {
        let data = {
            "eventId": eventId
        }
        axios.post('/notGoing', data).then(function(result) {
            console.log(result);
        })
        this.setState(() => ({backgroundColor: "transparent", color: "lightgray"}));
    }
}

export default DotTwo;