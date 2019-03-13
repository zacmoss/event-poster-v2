const axios = require('axios');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
Promise = require('bluebird');
mongoose.Promise = Promise;
require('dotenv').load();
const session = require('express-session');


let signedIn = false;

app.use(cors());

app.use(express.static(path.join(__dirname, 'front-end/build')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//app.use(session({secret: "discopuppy"}));
app.use(session({
    secret: "discopuppy",
    name: "cookie_name",
    proxy: true,
    resave: true,
    saveUninitialized: true
}));

const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("app server listening on" + port);
});

/*
app.route('/test').get(function (req, res) {
    res.sendFile(process.cwd() + '/front-end/public/test.html');
});
*/


const CONNECTION_STRING = process.env.DB;








// used to create test batch of events



// auto run on 1st of every month
let now = new Date();
nowString = now.toString();
nowString.split();
// getMonth returns a 0-11 month so we must add 1 to show displayable month
let nowMonth;
// mixing string number and numbers here.....could be issue when sorting later
if (now.getMonth() < 9) {
    nowMonth = "0" + (now.getMonth() + 1);
} else {
    nowMonth = now.getMonth() + 1;
}

if (nowString[9] == "1") {
    console.log('Just created new events for month');
    for (i = 1; i < 22; i++) {
    
        let testEvent = {
            "title": "",
            "description": "",
            "location": "",
            "time": "7:00pm",
            "date": "2019-12-14",
            "interested": [],
            "going": []
        }
        testEvent.title = "Test Event " + i;
        testEvent.description = "Test description for " + testEvent.title;
        testEvent.location = "Test Location";
        //testEvent.date = "2019-" + nowMonth + "-" + i;
        if (i < 10) {
            testEvent.date = "2019-" + nowMonth + "-0" + i;
        } else {
            testEvent.date = "2019-" + nowMonth + "-" + i;
        }
        //console.log(testEvent);
        
    
        MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
            let dbo = db.db("jive-database");
            let collection = dbo.collection('events');
            collection.insertOne(testEvent);
        });
        
    }
}

/*
i = 1;
for (i = 1; i < 26; i++) {
    
    let testEvent = {
        "title": "",
        "description": "",
        "location": "",
        "time": "7:00pm",
        "date": "2019-12-14",
        "interested": [],
        "going": []
    }
    testEvent.title = "Test Event " + i;
    testEvent.description = "Test description for " + testEvent.title;
    testEvent.location = "Test Location";
    if (i < 10) {
        testEvent.date = "2019-12-" + i;
    } else {
        testEvent.date = "2019-12-" + i;
    }

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('events');
        collection.insertOne(testEvent);
    });
}
*/










// Testing Search Events Feature
// works
/*
MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    let dbo = db.db("jive-database");
    let collection = dbo.collection('events');

    // sets fields in the db to make searchable by text
    // only need to do once???
    //collection.createIndex( { title: "text", description: "text", location: "text" } );

    collection.find({ $text: { $search: "central park" } }).toArray(function(err, result) {
    //collection.find({title: "Test Event 5"}, function(err, result) {

        console.log(result);

    });
});
*/



// Delete Old Events Feature

let today = new Date();

MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    let dbo = db.db("jive-database");
    let collection = dbo.collection('events');
    collection.find().toArray(function(err, result) {
        let todayTs = today.getTime();
        todayTs = todayTs - 86400000; /// pushing today's date back 1 day b/c it was deleting day of events
        let i = 0;
        for (i = 0; i < result.length; i++) {
            let dateTs = (new Date(result[i].date)).getTime(); // changes date to timestamp
            if (todayTs > dateTs) {
                try {
                    collection.deleteOne({_id: ObjectId(result[i]._id)});
                    console.log('successfully deleted event: ' + result[i].title);
                } catch (err) {
                    console.log(err)
                }
            }
        }
    });
});


// HTTP Requests

app.get('/getSignedInVar', (req, res) => {
    if (req.session.user) {
        res.send({message: "User is signed in", error: 0, signedIn: true})
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})

app.get('/eventFeed', (req, res) => {

    let loggedIn = undefined;
    req.session.user ? loggedIn = true : loggedIn = false;

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('events');
        collection.find().toArray(function(err, result) {
            let array = result;
            //console.log(array);

            // if user signedIn we touch db again at 'users' collection to check
            // for 'interested' or 'going'
            if (loggedIn) {
                MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
                    let dbo = db.db("jive-database");
                    let collection = dbo.collection('users');
                    collection.findOne({user: req.session.user}, function(err, result) {
                        //console.log('result here');
                        
                        
                        //req.session.interested = [];
                        //req.session.going = [];
                        //req.session.interested.push(result.interested);
                        //req.session.going.push(result.going);

                        req.session.interested = result.interested;
                        req.session.going = result.going;
                        // result.interested result.going
                        // push interested and going into req.session.interested

                        //console.log(req.session.interested);

                        res.send({
                            array: array,
                            loggedIn: loggedIn,
                            interested: req.session.interested,
                            going: req.session.going
                        })
                    })
                })

            } else { // not loggedIn
            
            res.send({ array: array, loggedIn: loggedIn });

            }
        })
    });
})
/*
app.post('/logout', (req, res) => {
    if (signedIn) {
        signedIn = false;
        req.session.destroy();
        res.send({message: "User has logged out", error: 0, signedIn: false});
        //window.location.reload(true);
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})
*/
app.post('/createEvent', (req, res) => {
    //res.set('Content-Type', 'text/json');

    let title = req.body.title;
    let location = req.body.location;
    let description = req.body.description;
    let time = req.body.time;
    let date = req.body.date;

    let eventObject = {
        "title": title,
        "description": description,
        "location": location,
        "time": time,
        "date": date,
        "interested": [],
        "going": []
    }

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('events');
        collection.insertOne(eventObject);
    });

    res.send({ title: title, location: location, description: description, time: time, date: date });

})

app.post('/deleteOldEvents', (req, res) => {
    // get today's date
    // map through database
    // if event date is before today's delete event

    res.send({message: "working"});
})

app.post('/createUser', (req, res) => {

    let user = req.body.user;
    let password = req.body.password;

    /* old without interested and going */
    let userObject = {
        "user": user,
        "password": password,
        "interested": [],
        "going": []
    }

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('users');
        collection.findOne({user: user}, function(err, result) {
            if (result) {
                res.send({message: "User already exists", error: 1, signedIn: false});
            } else {
                collection.insertOne(userObject);
                signedIn = true;
                collection.findOne({user: user}, function(err, result) {
                    req.session.userId = result._id;
                    req.session.user = req.body.user;
                    req.session.password = req.body.password;
                    res.send({message: "User successfully created", error: 0, signedIn: true});
                })
                
            }
        });
    });
})

app.post('/loginUser', (req, res) => {

    // when user logs in we push a new sessionObject to sessionArray
    // bc i'm not sure if there can be multiple users on one server at a time??

    // the sessionObjects in sessionArray are to be used here on server to grab
    // 'interested' and 'going'
    
    // --------- Check database for user --------
    //let userId = req.body._id;
    let user = req.body.user;
    let password = req.body.password;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('users');
        collection.findOne({user: user}, function(err, result) {
            if (result) {
                if (result.password === password) {
                    //console.log(result);
                    
                    signedIn = true;
                    req.session.userId = result._id;
                    req.session.user = req.body.user;
                    req.session.password = req.body.password;
                    /* don't need bc we're just tagging this onto req.session object
                    let interested = result.interested;
                    let going = result.going;
                    let sessionObject = {
                        "userId": req.session.userId,
                        "interested": interested,
                        "going": going
                    }
                    sessionArray.push(sessionObject);
                    console.log(sessionObject);
                    console.log(sessionArray);
                    */
                    res.send({message: "Successfully signed in", error: 0, signedIn: true});
                } else {
                    res.send({message: "Password incorrect", error: 2, signedIn: false});
                }
            } else {
                collection.insertOne(userObject);
                res.send({message: "User does not exist", error: 1, signedIn: false});
            }
        });
    });
})

app.post('/logout', (req, res) => {
    if (signedIn) {
        signedIn = false;
        req.session.destroy();
        res.send({message: "User has logged out", error: 0, signedIn: false});
        //window.location.reload(true);
    } else {
        res.send({message: "User not signed in", error: 1, signedIn: false})
    }
})


// interested and going post requests
// works
app.post('/interested', (req, res) => {
    eventId = req.body.eventId;

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('users');
        collection.findOne({user: req.session.user}, function(err, result) {
            if (!result.interested.includes(eventId)) { // if eventId not in interested
                collection.findOneAndUpdate( // insert this eventId
                    {user: req.session.user},
                    { $push: {interested: eventId}},
                    function(err, result) {
                        if (result) {
                            res.send({message: "EventId successfully saved to userObject"});
                        } else {
                            res.send({message: 'Error with insertion'});
                        }
                    }
                )
            } else {
                res.send({message: "User already interested in this event"});
            }
        })
        
    })
})

app.post('/notInterested', (req, res) => {
    eventId = req.body.eventId;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('users');
        collection.findOne({user: req.session.user}, function(err, result) {
            if (result.interested.includes(eventId)) { // if eventId in interested
                collection.findOneAndUpdate( // remove this eventId from interested
                    {user: req.session.user},
                    { $pull: {interested: eventId}},
                    function(err, result) {
                        if (result) {
                            res.send({message: "EventId successfully removed from userObject"});
                        } else {
                            res.send({message: 'Error with removal'});
                        }
                    }
                )
            } else {
                res.send({message: "User not interested in this event already"});
            }
        })
        
    })
})

app.post('/going', (req, res) => {
    eventId = req.body.eventId;

    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('users');
        collection.findOne({user: req.session.user}, function(err, result) {
            if (!result.going.includes(eventId)) { // if eventId not in going
                collection.findOneAndUpdate( // insert this eventId
                    {user: req.session.user},
                    { $push: {going: eventId}},
                    function(err, result) {
                        if (result) {
                            res.send({message: "EventId successfully saved to userObject"});
                        } else {
                            res.send({message: 'Error with insertion'});
                        }
                    }
                )
            } else {
                res.send({message: "User already going to this event"});
            }
        })
        
    })
})

app.post('/notGoing', (req, res) => {
    eventId = req.body.eventId;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('users');
        collection.findOne({user: req.session.user}, function(err, result) {
            if (result.going.includes(eventId)) { // if eventId in going
                collection.findOneAndUpdate( // remove this eventId from going
                    {user: req.session.user},
                    { $pull: {going: eventId}},
                    function(err, result) {
                        if (result) {
                            res.send({message: "EventId successfully removed from userObject"});
                        } else {
                            res.send({message: 'Error with removal'});
                        }
                    }
                )
            } else {
                res.send({message: "User not going to this event already"});
            }
        })
        
    })
})

app.post('/searchEvents', (req, res) => {
    console.log('Search String:');
    console.log(req.body.searchString);
    let loggedIn = undefined;
    req.session.user ? loggedIn = true : loggedIn = false;
    let searchString = req.body.searchString;
    MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
        let dbo = db.db("jive-database");
        let collection = dbo.collection('events');
        collection.find({ $text: { $search: searchString } }).toArray(function(err, result) {
            //console.log(result);
            //res.send(result);
            let array = result;
            if (loggedIn) {
                MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
                    let dbo = db.db("jive-database");
                    let collection = dbo.collection('users');
                    collection.findOne({user: req.session.user}, function(err, result) {
                        req.session.interested = result.interested;
                        req.session.going = result.going;
                        res.send({
                            array: array,
                            loggedIn: loggedIn,
                            interested: req.session.interested,
                            going: req.session.going
                        })
                    })
                })
            } else { // not loggedIn
            res.send({ array: array, loggedIn: loggedIn });
            }
        });
    });
})


module.exports = app;