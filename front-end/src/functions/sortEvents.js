const sortEvents = function(array) {
    // iterates through array and changes date to timestamp
    let i = 0;
    for (i = 0; i < array.length; i++) {
        
        let x = new Date(array[i].date);
        let y = x.getTime();

        // Do this b/c of the whole error with created events being set as GMT somehow
        // And then they are converted to CST when set to timestamp
        // Couldn't figure out, so just adding 6 hours to timestamp fixes the issue
        // For CST timezone at least
        // Need to have permanent fix when dealing with other timezones
        let z = y + 21600000;

        //array[i].date = y;
        array[i].date = z;
    }
    
    // sorts the array's timestamps from lowest to highest
    array.sort(function(a,b) {
        a = a.date;
        b = b.date;
        return a<b ? -1 : a>b ? 1 : 0;
     });
     
    // iterates through array and changes date from timestamp to formatted string
    i = 0;
    for (i = 0; i < array.length; i++) {
            
        //////// Error is here. When we try to convert timestamp back to date.
        //////// The timestamp was in GMT while our conversion is to CT....
        //////// False, original date was GMT, timestamp was CST

        //////// Can we order dates without converting to timestamp

        //////// Or we could just add a day...b/c the time on sorted Dates is always
        //////// set to 0:00 automatically....so we don't have to worry about time...

        //////// Problem is...it won't be like this everywhere...it'll depend
        //////// on the user's timezone...

        //////// So, at some point we would need to grab user's timezone
        //////// and adjust according to that.....

        //////// Can't just add a day b/c of alternating days in certain months...

        //////// Could try just adding 6 hours to timestamp??? And like wise for
        //////// other timezones when we get to that point....

        //////// Why is function sorting comp generated events correctly though...
            
        //let z = new Date(1352851200000);
        let z = new Date(array[i].date);

        let a = z.toString();
        let b = a.split(" ");
        let month = b[1];
        switch (month) {
            case "Jan":
                month = "January";
                break;
            case "Feb":
                month = "February";
                break;
            case "Mar":
                month = "March";
                break;
            case "Apr":
                month = "April";
                break;
            case "Jun":
                month = "June";
                break;
            case "Jul":
                month = "July";
                break;
            case "Aug":
                month = "August";
                break;
            case "Sep":
                month = "September";
                break;
            case "Oct":
                month = "October";
                break;
            case "Nov":
                month = "November";
                break;
            case "Dec":
                month = "December";
                break;
            default:
                break;
        }
        let day = b[2];
        let year = b[3];
        array[i].date = month + " " + day + ", " + year;
    }
    return array;
}

export default sortEvents;