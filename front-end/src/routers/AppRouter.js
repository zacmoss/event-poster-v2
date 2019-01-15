import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import '../style.css';
import CreateEventPage from '../components/CreateEventPage';
//import Header from '../components/Header';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import Footer from '../components/Footer';
import SignUpPage from '../components/SignUpPage';
import createHistory from 'history/createBrowserHistory';
//import axios from 'axios';


// maybe store state in AppRoute

// maybe store a signedUp variable on the server and make a request for 
// signedUp here at AppRouter on every reload and get that signedUp variable

// Original design had Header above the Routes staying constantly rendered, but
// wanted to pass signedIn to header to conditional render buttons

export const history = createHistory();

class AppRouter extends React.Component { // Client-Side Routing

    /*
    componentDidMount() {
        console.log('rendered');
        axios.get('/getSignedIn').then(function(result) {
            console.log(result.data);
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }
    */

    render() {
        
        return (
            <Router history={history}>
                <div className="page_container">
                    <Switch>
                        <Route path="/" component={HomePage} exact={true} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/signUp" component={SignUpPage} />
                        <Route path="/createEvent" component={CreateEventPage} />
                        <Route component={NotFoundPage} />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        )
    }
}

export default AppRouter;