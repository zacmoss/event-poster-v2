import React from 'react';
import '../style.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signedIn: undefined
        }

       this.logout = this.logoutHandler.bind(this);

    }
    
    componentWillMount() {
        let self = this;
        axios.get('/getSignedInVar').then(function(result) {
            console.log(result.data);
            if (result.data.signedIn === true) {
                self.setState(() => ({ signedIn: true }));
                console.log('signed in');
                console.log(self.state.signedIn);
            } else {
                self.setState(() => ({ signedIn: false }));
                console.log('not signed in');
            }
        }).catch(function(err) {
            console.log("error: " + err);
        })
    }

    render() {
        // ---- removed elements ---- 
        // <Link className="link" to="/">Home</Link>

        return (
            <div className="header_container">
                <div><h1><Link className="logo" to="/">Event Poster</Link></h1></div>
                <p className="nav_container">
                    {this.state.signedIn === false && <Link className="link link_login" to="/login">Login</Link>}
                    {this.state.signedIn === false && <Link className="link link_signUp" to="/signUp">Sign Up</Link>}
                    {this.state.signedIn && <span className="link" onClick={this.logout}>Logout</span>}
                </p>
            </div>
        )
    }

    logoutHandler() {
        let self = this;
        axios.post('/logout').then(function(response) {
            alert(response.data.message);
            self.setState(() => ({ signedIn: false }));
            window.location.reload(true);
        }).catch(function(err) {
            console.log("catch error: " + err);
        })
    }

    /*
    searchEvents(e) {
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
    */
}

export default Header;