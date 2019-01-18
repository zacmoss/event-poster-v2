/* proxy in front-end/package.json is used to basically tell create-react-app to
    point to that port for server duties which has the server running on it....

    create-react-app has default config where you would normally have a webpack config
    file, entry point seems to be index.js...


    Using React-Router for 'multiple pages,' technically still on one page, but 
    re-rendered is how I understand it.


    Maybe use Axios on 'Page' components to send requests to server, then server
    would hit the mongodb and retrieve info sending back, finally pull in the server
    response with Axios and render. For LoginPage, probably would redirect
    to homepage if user is confirmed, if user not confirmed redirect to error page.
    

    The reason that I'm sticking the Header component in each page is b/c 
    I need to be able to pass signedIn and have Header re-render. Could use redux,
    but would rather not over complicate...
    
    For login we're using express-session to show active sign in even after a refresh
    and storing user login info in mongodb 'jive-database' - 'users'

    Using window.location.reload(true) on Header component when user logs out to reset
    the event feed to not display 'going' and 'interested

    For Interested and Going feature - On EventFeed we have DotOne and DotTwo as 
    separate components. As EventFeed loads the /eventFeed call to server gets all events, 
    but also checks if user is signed in, if so server grabs interested and going arrays
    which are attached to userObject on req.session. Server then sends those arrays
    back to the client. EventFeed then checks these arrays for the particular eventId
    on the current iteration. If the id is there, it turns onOff to true. This onOff
    variable is sent as a prop to DotOne and DotTwo components. The DotOne and DotTwo
    components then are colored yellow, green, or transparent depending on that passed
    prop. Further, on DotOne and DotTwo there are onClick handlers which send requests
    to server to add that eventId to interested or going arrays on the userObject in
    the database and can also remove the eventId from interested or going.

    For All / Interested / Going filter tabs - Had to move eventFeed render logic to
    a helper function which gets called on componentWillMount and when user clicks on
    tabs to filter events. The new eventFeed is then render and filters out interested
    and going accourdingly before changing the state on the array which is rendered
    conditionally on component's render.

    HUGE new info here - Finally learned how to set env variables in a production
    environment. You have to set them in THAT particular environment. In heroku, 
    in the app's settings there is an option to set a key value pair for the env
    variable.

    dateConverter.js no longer being used b/c when we sortEvents by date it alters the
    original array for some reason, so we had to do the convert to a formatted date in 
    sortEvents...

    On server.js located just above the HTTP requests, there is an action which deletes
    events which are dated before today's date. This deletes old events automatically.

    Page count and next buttons are super confusing. Basically, once we have the mapArray
    which is what becomes our eventFeed (It's already been filtered for interested and
    going), now we break it into two arrays. The first ten get stored in shownArray or
    firstArray as well as storedArray, the rest get pushed only to storedArray. 
    If interested or going filters are in effect we have if statements which don't push a 
    particular mapArray item if it is null which is what is returned if interested or going 
    filters are applied and the array item is not interested or going. Now, in regard to next 
    button, we have a handler which grabs pageCount and saves the next 10 events from 
    storedArray to array (which is our state variable for events shown). We then add 1
    to pageCount state. For previous, we do the same, but backwards and subtract 1 from 
    pageCount state.

    So, there is an issue with displaying the event dates from user created events. Basically,
    the issue happens in the sortEvents function. For some reason, the date we pass in is
    treated as if it is GMT time I believe...then it's converted to a timestamp which is in
    CST my local timezone, which is 6 hours less than the original date intended, which due
    to the date being created at 00:00 time this pushes the day back by 1. So, the day
    displayed for a user created event was off by 1. My short term fix for this is just
    to add 6 hours to the timestamp which returns it to the correct day for now. This would
    need to be changed  in the future b/c it will not work for users in other timezones,
    particularly users west of me...We may need to eventually find a way to create a 
    custom date object at event creation which is sorted that way...Or we can consider
    sorting event dates by year, then month, then day and never convert to timestamp...

    Small bug regarding search feature - The mongodb $search will search entire string
    provided for similarities in database. For example, Test Event 5 will return all
    events with text of test and event. So, we won't just get Test Event 5 in our search.
    If I want to eventually have a strict search we would need multiple db calls on the
    server function which finds name: searchString, then a seperate db call for location:
    searchString, description: searchString, etc..... and if we were pushing results from
    each we would also have to do checks in existing pushArray for events we pushed on
    previous db calls....all before sending data back to server


    To Do

    Fix error where, if they're not logged in and search events, we have no way
    to go back to showing all events. Maybe have a show all button. For sure,
    at least if they click Event Poster logo we need to re-render all events. Maybe
    have a scenario where if they clear search bar and hit enter it shows all again.

    Need to figure out how to clear search bar input when I click off search results
    to something else, like 'all' or 'interested' etc...
    
    Remove req.sessions.password = req.body.password from server.js at http request
    'createUser' b/c you don't use req.sessions.password and I think that's probably
    a security vulnerability....test after change though.

    Make a lower nav for create events, maybe search, other stuff? About us?

    Make errors show on form rather than alert when logging in, sign up, or create event

    For filter, could add a tags array to each eventObject, and add all strings
    in title, description, location...that way we can just search each tags array
    for each event when running a search using terms...

    Style logout button

    Maybe add event feed filter

    Upload to production shell for git and heroku
    
    Clear server.js clutter

    Clear un-needed files

    Finish Style 2 - decided final Style 2

    *Page for Upcoming Events with category banners - Banners with three events on a
    row with a view all <category> events link





    Save a Style 1 (Base) final and a Style 2 (NYC) final

    Style 1 re-add inset box shadow at top of homepage, form page. Add box shadow to
    form container and submit button. Add gray background color for forms.

    Add event feed filter on left section of home page to filter events

    Could not do 'going' 'interested' as handlers, maybe try to make the dots components
    and pass the needed data into the component as props

    Need to clean up server.js and possibly remove all the signedIn variables, b/c
    of use of express-sessions

    Use event ids and pass them to user's going or interested arrays

    When Logged in have event feed show going or interested

    When Logged in allow user to click going or interested and save that (would 
    need to either re-render page to show change or just change color on a click and 
    let the 'true result' show when feed is rendered again or could only have going
    and interested butttons on a page after we click on specific event)

    Limit description words/characters amount on event feed, with a show more link
    at the end.

    Let user click on event card to see in depth event.

    Add date input for createEvents and add to server file db creation and eFeed display

    Consider different 'going' 'interested' display style in event cards. Maybe have
    grayed out 'interested' 'going' and if they click they are pushed and highlighted

    Need to figure out a solution to keeping mongodb key in .env




    Styles

    Stye 1

    Too boring...



    Style 2

    Pic 4 - New York Night Background - Grayish Blue Asthetic

    Can't figure out what is best way to do height on form pages, bc on page loads
    background pic moves bc of differing heights...but all attempts to fix this
    cause a different issue. For example, on trying to set a fixed height on
    form_page_container the form is stretching to length of page, not sure why...
    
*/
