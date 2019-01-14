import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style.css';
import DotOne from './DotOne';
import DotTwo from './DotTwo';
//import convertDate from '../dateConverter';
import sortEvents from '../functions/sortEvents';

class SearchResults extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.state = {
            array: undefined,
            signedIn: undefined,
            feed: "all",
            eventCount: 0,
            totalEvents: 0,
            storedEvents: [],
            pageCount: 0,
            nextButton: true,
            previousButton: false
        }
        this.allFilterHandler = this.allFilterHandler.bind(this);
        this.interestedFilterHandler = this.interestedFilterHandler.bind(this);
        this.goingFilterHandler = this.goingFilterHandler.bind(this);
        this.nextHandler = this.nextHandler.bind(this);
        this.previousHandler = this.previousHandler.bind(this);
    }

    componentWillMount() {
        let self = this;
        console.log(this.props.array);
        this.setState(() => ({ array: this.props.array }));
        axios.get('/getSignedInVar').then(function(result) {
            console.log(result.data);
            if (result.data.signedIn === true) {
                self.setState(() => ({ signedIn: true }));
            } else {
                self.setState(() => ({ signedIn: false }));
            }
           //self.renderEvents();
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }
    /*
    renderEvents() {
        let self = this;
        // get signIn variable stored on server
        axios.get('/getSignedInVar').then(function(result) {
            if (result.data.signedIn === true) {
                self.setState(() => ({ signedIn: true }));
            } else {
                self.setState(() => ({ signedIn: false }));
            }
            axios.get('/eventFeed').then(response => {
                let eventsArray = this.state.array; ///////// takes events from passed in props
                let eventCount = 0;
                let newArray = sortEvents(eventsArray);
                let mapArray = newArray.map(function(ele) {
                    let displayEvent = true;
                    let dotOne = {
                        "onOff": false
                    }
                    let dotTwo = {
                        "onOff": false
                    }
                    if (response.data.interested && response.data.interested.length > 0) {
                        let i = 0;
                        for (i = 0; i < response.data.interested.length; i++) {
                            if (response.data.interested[i] === ele._id) {
                                dotOne.onOff = true;
                            }
                        }
                    }
                    if (response.data.going && response.data.going.length > 0) {
                        let i = 0;
                        for (i = 0; i < response.data.going.length; i++) {
                            if (response.data.going[i] === ele._id) {
                                dotTwo.onOff = true;
                            }
                        }
                    }
                    
                    if (self.state.feed === "interested") {
                        if (dotOne.onOff === false) {
                            displayEvent = false;
                            //console.log('display switch to false');
                        }
                    }
                    if (self.state.feed === "going") {
                        if (dotTwo.onOff === false) {
                            displayEvent = false;
                        }
                    }
                    
                    if (displayEvent === true) {

                        eventCount += 1;
                        let titleDisplay;
                        let descriptionDisplay;
                        let locationDisplay;

                        if (ele.title.length > 23) {
                            if (ele.title[22] === " ") {
                                titleDisplay = ele.title.slice(0, 22) + "...";
                            } else {
                                titleDisplay = ele.title.slice(0, 23) + "...";
                            }
                        } else {
                            titleDisplay = ele.title;
                        }

                        if (ele.description.length > 100) {
                            if (ele.description[99] === " ") {
                                descriptionDisplay = ele.description.slice(0, 99) + "...";
                            } else {
                                descriptionDisplay = ele.description.slice(0, 100) + "...";
                            }
                        } else {
                            descriptionDisplay = ele.description;
                        }

                        if (ele.location.length > 23) {
                            if (ele.location[22] === " ") {
                                locationDisplay = ele.location.slice(0, 22) + "...";
                            } else {
                                locationDisplay = ele.location.slice(0, 23) + "...";
                            }
                        } else {
                            locationDisplay = ele.location;
                        }
                        
                        return (
                            <div className="event_container" key={ele._id}>
                                <div className="event_top">
                                    <div className="event_top_left_space">
                                    <p className="event_title">{titleDisplay}</p>
                                    </div>
                                    <div className="event_top_right_space">
                                        {response.data.loggedIn && <DotOne onOff={dotOne.onOff} eventId={ele._id} />}
                                        {response.data.loggedIn && <DotTwo onOff={dotTwo.onOff} eventId={ele._id} />}
                                    </div>
                                </div>
                                
                                <p>{descriptionDisplay}</p>
                                <div className="event_bottom_line">
                                    <span className="event_bottom_item">{locationDisplay}</span>
                                    <span className="event_dash">|</span>
                                    <span className="event_bottom_item">{ele.time}</span>
                                    <span className="event_dash">|</span>
                                    <span className="event_bottom_item">{ele.date}</span>
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                });
                
                let shownEvents = [];
                let storedEvents = [];
                if (mapArray.length > 10) {
                    let i = 0;
                    let count = 0;
                    for (i = 0; i <= mapArray.length - 1; i++) {
                        if (shownEvents.length > 9) {
                            if (mapArray[i] !== null) { // if event is null b/c of interested and going don't include it 
                                storedEvents.push(mapArray[i]);
                            }
                        } else {
                            if (count < 10) {
                                if (mapArray[i] !== null) { // if event is null b/c of interested and going don't include it
                                    storedEvents.push(mapArray[i]);
                                    shownEvents.push(mapArray[i]);
                                    count++;
                                }
                            } else {
                                storedEvents.push(mapArray[i]);
                                count = 0;
                            }
                        }
                    }
                } else {
                    shownEvents = mapArray;
                    storedEvents = mapArray;
                }
                
                eventCount = shownEvents.length;
                if (shownEvents.length < 10) {
                    self.setState(() => ({
                        array: shownEvents,
                        eventCount: eventCount,
                        totalEvents: storedEvents.length,
                        storedEvents: storedEvents,
                        pageCount: 1,
                        nextButton: false,
                        previousButton: false
                    }));
                } else {
                    if (storedEvents.length > 10) {
                        self.setState(() => ({
                            array: shownEvents,
                            eventCount: eventCount,
                            totalEvents: storedEvents.length,
                            storedEvents: storedEvents,
                            pageCount: 1,
                            nextButton: true,
                            previousButton: false
                        }));
                    } else {
                        self.setState(() => ({
                            array: shownEvents,
                            eventCount: eventCount,
                            totalEvents: storedEvents.length,
                            storedEvents: storedEvents,
                            pageCount: 1,
                            previousButton: false
                        }));
                    }
                }
            }); // for request 'eventFeed'
        }).catch(function(err) { // for request 'getSignedInVar'
            console.log("error: " + err);
        })
    }*/
    
    render() {
        return (
            <div className="mid_section">
                <h2>Search Results</h2>
                {this.state.signedIn && <div className="event_feed_tab_container">
                    
                        <span className="tab" style={{color: this.state.feed === "all" ? "black" : "rgba(100, 100, 100, .4)"}} onClick={this.allFilterHandler}>All</span>
                        <span className="interestedTab" style={{color: this.state.feed === "interested" ? "black" : "rgba(100, 100, 100, .4)"}} onClick={this.interestedFilterHandler} title="Only show events you're interested in">Interested</span>
                        <span className="tab" style={{color: this.state.feed === "going" ? "black" : "rgba(100, 100, 100, .4)"}} onClick={this.goingFilterHandler} title="Only show events you're going to">Going</span>
                    
                </div>}
                {!this.state.signedIn && <p className="message"><Link className="message_link" to="/login">Sign in</Link> to access more features.</p>}
                {this.state.eventCount === 0 && <div className="event_container"><p style={{textAlign: "center"}}>No events to show</p></div>}
                <div className="events_array"><div>{this.state.array}</div></div>
                <div className="message_bottom">
                    <p>Showing {this.state.eventCount} events out of {this.state.totalEvents} total events. 
                    {this.state.previousButton ? <span className="next_button" onClick={this.previousHandler}>&#x3c; Previous</span> : null}
                        {this.state.nextButton ? <span className="next_button" onClick={this.nextHandler}>Next &#x3e;</span> : null}
                    </p>
                </div>
                
            </div>
        )
    }

    allFilterHandler() {
        this.setState(() => ({feed: "all"}));
        this.renderEvents();
    }
    interestedFilterHandler() {
        this.setState(() => ({feed: "interested"}));
        this.renderEvents();
    }
    goingFilterHandler() {
        this.setState(() => ({feed: "going"}));
        this.renderEvents();
    }
    nextHandler() {
        // needs to be a pageCount state
        // and depending on what pageCount is if we go next or back
        // we can show correct events

        // firstTen would be pageCount 1
        // then on pageCount 2 we show storedEvents[10 - 19]
        // on pageCount 3 we show storedEvents[20 - 29]
        // and so on
    
        let removeBefore = this.state.pageCount * 10;
        let array = this.state.storedEvents.slice();
        array.splice(0, removeBefore);
        let shownArray = array.splice(0, 10);
        console.log(array);

        let eventCount = removeBefore + shownArray.length;
        let nextPage = this.state.pageCount + 1;

        // if pressing next again would lead to 0 events, change nextButton to false
        // array is what is left over after the splicing, so if nothing left, then nothing to show
        if (array.length < 1) {
            this.setState(() => ({array: shownArray, eventCount: eventCount, pageCount: nextPage, nextButton: false, previousButton: true}))
        } else {
            this.setState(() => ({array: shownArray, eventCount: eventCount, pageCount: nextPage, previousButton: true}));
        }
    }
    previousHandler() {
        let array = this.state.storedEvents.slice(); // clones storedEvents array
        let backEnd = (this.state.pageCount * 10) - 10; // (19) (e[10] - e[19]) - page 2
        let frontEnd = (backEnd - 10);
        let shownArray = array.splice(frontEnd, 10);
        let eventCount = (shownArray.length + frontEnd); //this.state.storedEvents.length; // fix this //////////////////
        let previousPage = this.state.pageCount - 1;
        if (backEnd === 10) {
            this.setState(() => ({array: shownArray, eventCount: eventCount, pageCount: previousPage, nextButton: true, previousButton: false}));
        } else {
            this.setState(() => ({array: shownArray, eventCount: eventCount, pageCount: previousPage, nextButton: true}));
        }
    }
}

export default SearchResults;