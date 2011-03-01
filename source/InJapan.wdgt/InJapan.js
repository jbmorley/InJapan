// The date the timer expires.
Expires = new Date(2005, 7, 13, 13, 00, 00);

// The current country.
var Country = 0; // default to JP.

// Start things happening.
Id = window.setTimeout("loadPreferences(); displayTime();", 1000);

function loadPreferences() {
    // Get the date.
    var now = new Date();

    // Add the offset to the date.
    now.setTime(now.getTime() + 3600000);

    // Get the elements.
    var daySelect = document.getElementById("day");
    var monthSelect = document.getElementById("month");
    var yearSelect = document.getElementById("year");
    var hourSelect = document.getElementById("hour");
    var minuteSelect = document.getElementById("minute");
    var countrySelect = document.getElementById("country");

    // Check to see if any settings have been stored
    // for this instance of the widget.
    var day = widget.preferenceForKey(createKey("Day"));
    var month = widget.preferenceForKey(createKey("Month"));
    var year = widget.preferenceForKey(createKey("Year"));
    var hour = widget.preferenceForKey(createKey("Hour"));
    var minute = widget.preferenceForKey(createKey("Minute"));
    var country = widget.preferenceForKey(createKey("Country"));

    // Check that they are all defined.
    // If they are not defined, then set the timer for an hour in the
    // future.
    // As I do not know of a 'defined' funciton in javascript, this
    // will have to suffice as a reasonable check.
    if (!day && !month && !year && !hour && !minute) {

        // Re-calculate the values.
        day = now.getDate();
        month = now.getMonth()
        year = now.getYear();
        hour = now.getHours();
        minute = now.getMinutes();

        // Save these as the settings for this widget.
        widget.setPreferenceForKey(day, createKey("Day"));
        widget.setPreferenceForKey(month, createKey("Month"));
        widget.setPreferenceForKey(year, createKey("Year"));
        widget.setPreferenceForKey(hour, createKey("Hour"));
        widget.setPreferenceForKey(minute, createKey("Minute"));

    }
    
    if (!country) {
        widget.setPreferenceForKey(Country, createKey("Country"));    
    } else {
        // Apply the country settings.
        // This is being done in a separate else block as it
        // is a newly added feature and users of older versions
        // will not have this setting, so it needs to default correctly.
        Country = country;
    }

    // Set the elements.
    daySelect.options[day-1].selected = true;
    monthSelect.options[month].selected = true;
    // TODO
    yearSelect.options[year-105].selected = true;
    hourSelect.options[hour].selected = true;
    minuteSelect.options[minute].selected = true;
    countrySelect.options[Country].selected = true;

    // Set the time.
    Expires = new Date(year+1900, month, day, hour, minute, 00);
    
    // Set the country.
    displayCountry();     
}

function savePreferences() {
    // Get the elements.
    var daySelect = document.getElementById("day");
    var monthSelect = document.getElementById("month");
    var yearSelect = document.getElementById("year");
    var hourSelect = document.getElementById("hour");
    var minuteSelect = document.getElementById("minute");
    var countrySelect = document.getElementById("country");

    // Get the time.
    var day = daySelect.options[daySelect.selectedIndex].value;
    var month = monthSelect.options[monthSelect.selectedIndex].value - 1;
    var year = yearSelect.options[yearSelect.selectedIndex].value - 1900;
    var hour = hourSelect.selectedIndex;
    var minute = minuteSelect.selectedIndex;
    var country = countrySelect.selectedIndex;

    // Save the setting.
    widget.setPreferenceForKey(day, createKey("Day"));
    widget.setPreferenceForKey(month, createKey("Month"));
    widget.setPreferenceForKey(year, createKey("Year"));
    widget.setPreferenceForKey(hour, createKey("Hour"));
    widget.setPreferenceForKey(minute, createKey("Minute"));
    widget.setPreferenceForKey(country, createKey("Country"));

    // Set the new time.
    Expires = new Date(year+1900, month, day, hour, minute, 00);
    
    Country = country;

    // Force a re-initialization just incase we have already
    // stopped the timer.
    hideSplash();
    displayCountry();
    displayTime();

}

// Inspired by Apple's World Clock widget.
function createKey(key) {
    return widget.identifier + "-" + key;
}

function displayCountry() {
    var countryImg = document.getElementById("countryImg");
    countryImg.src = "Default-" + Country + ".png";
    var overlayImg = document.getElementById("overlayImg");
    overlayImg.src = "Overlay-" + Country + ".png";    
}

function displayTime() {
    // Get the date.
    var Now = new Date();

    // Millseconds remaining.
    Remaining = Expires - Now;
    AlwaysRemaining = Remaining;

    // Check that we haven't reached the end.
    if (Remaining <= 0) {
	Remaining = 0;
    }

    // Millsecond Conversions.
    // seconds = 1,000
    // minutes = 60,000
    // hours = 3,600,000
    // days = 86,400,000

    Days = parseInt(Remaining/86400000);
    Remaining = Remaining % 86400000;

    Hours = parseInt(Remaining/3600000);
    Hours = ((Hours < 10) ? "0" : "") + Hours;
    Remaining = Remaining % 3600000;

    Minutes = parseInt(Remaining/60000);
    Minutes = ((Minutes < 10) ? "0" : "") + Minutes;
    Remaining = Remaining % 60000;

    Seconds = parseInt(Remaining/1000);
    Seconds = ((Seconds < 10) ? "0" : "") + Seconds;
    Remaining = Remaining % 1000;

    Milliseconds = Remaining;
    if (Milliseconds < 10) {
        Milliseconds = "00" + Milliseconds;
    } else if (Milliseconds < 100) {
        Milliseconds = "0" + Milliseconds;
    }

    // If we are still counting...
    if (AlwaysRemaining > 0) {
        // Display the date.
        timediv = document.getElementById("time");
        // timediv.innerHTML
        // = Days+" days<br/>"+Hours+":"+Minutes+":"+Seconds+":"+Milliseconds;
        timediv.innerHTML
            = Days+" days<br/>"+Hours+":"+Minutes+":"+Seconds;

        // Wait, then run again.
        // Id = window.setTimeout("displayTime();", 75);
        Id = window.setTimeout("displayTime();", 500);
    } else {
        timediv = document.getElementById("time");
        timediv.innerHTML = "";

        showSplash();
    }
}

function showSplash() {
    document.getElementById('overlay').style.display = 'block';
}

function hideSplash() {
    document.getElementById('overlay').style.display = 'none';
}

/*
 * setup() is run when the body loads.  It checks to see if there is a preference
 * for this widget and if so, applies the preference to the widget.
 */
function setup() {

    // Check we are running in Dashboard.
    if (window.widget) {}
    
    // Construct the button.
    createGenericButton(document.getElementById('done'), 'Back', hidePrefs);

	// Set the options.    
	setOptionsYear('year');
	setOptionsMonth('month');
	setOptions('day', 1, 31, 1);
	setOptions('hour', 0, 23, 1);    
    setOptions('minute', 0, 59, 5);
    
}

function a(name, text, value) {
	addOptionValue(name, text, value);
}

function addOptionValue(name, text, value) {
	var select = document.getElementById(name);
	var opt = document.createElement('option');
	opt.text = text;
	opt.value = value;
	select.add(opt, null);
}

function addOptionInteger(name, value) {
	// Ensure the title is two digits.
	var text = value;
	if (text < 10) {
		text = "0" + text;
	}
	addOptionValue(name, text, value);
}

function setOptions(name, min, max, inc) {
	for (var i=min; i<max+1; i+=inc) {
		addOptionInteger(name, i);
	}
}

function setOptionsYear(name) {
    // Populate the dates.
    var date = new Date();
    var year = 1900 + date.getYear();
    var years = new Array();
    
    // Update the year UI widget - 5 years into the future
    for (var i=0; i<5; i++) {
    	var currYear = year + i;
		addOptionValue(name, currYear, currYear);
    }
}

function setOptionsMonth(name) {
    addOptionValue(name, 'Jan', 1);
    addOptionValue(name, 'Feb', 2);
    addOptionValue(name, 'Mar', 3);
    addOptionValue(name, 'Apr', 4);
    addOptionValue(name, 'May', 5);
    addOptionValue(name, 'Jun', 6);
    addOptionValue(name, 'Jul', 7);
    addOptionValue(name, 'Aug', 8);
    addOptionValue(name, 'Sep', 9);
    addOptionValue(name, 'Oct', 10);
    addOptionValue(name, 'Nov', 11);
    addOptionValue(name, 'Dec', 12);
}


// Show the preferences.
function showPrefs() {
    var front = document.getElementById("front");
    var back = document.getElementById("back");
	
    // Freezes the widget so that you can change it without the user noticing
    if (window.widget)
        widget.prepareForTransition("ToBack");
	
    front.style.display="none";	// hide the front
    back.style.display="block";	// show the back

    // Flip the widget over.
    if (window.widget)
        setTimeout ('widget.performTransition();', 0);

    // Clean up the front side - hide the circle behind the info button
    document.getElementById('fliprollie').style.display = 'none';
}

// Hide the preferences.
function hidePrefs() {

    // First, change the settings to reflect those on the
    // preferences screen.
    savePreferences();

    var front = document.getElementById("front");
    var back = document.getElementById("back");

    // Freezes the widget and prepares it for the flip back to the front
    if (window.widget)
        widget.prepareForTransition("ToFront");
	
    back.style.display="none"; // hide the back
    front.style.display="block"; // show the front

    // Flip the widget back to the front
    if (window.widget)
        setTimeout ('widget.performTransition();', 0);
}


// PREFERENCE BUTTON ANIMATION (- the pref flipper fade in/out)

// A flag used to signify if the flipper is currently shown or not.
var flipShown = false;

// A structure that holds information that is needed for the animation to run.
var animation = {
                 duration:0,
                 starttime:0,
                 to:1.0,
                 now:0.0,
                 from:0.0,
                 firstElement:null,
                 timer:null
                };

/*
mousemove() is the event handle assigned to the onmousemove property on
the front div of the widget.
It is triggered whenever a mouse is moved within the bounds of your widget.
It prepares the preference flipper fade and then calls animate() to performs
the animation.
*/

function mousemove (event) {
    // if the preferences flipper is not already showing...
    if (!flipShown) {
        // reset the animation timer value, in case a value was left behind
        if (animation.timer != null) {
	    clearInterval(animation.timer);
	    animation.timer = null;
        }

        // Set it back one frame
        var starttime = (new Date).getTime() - 13;
		
	animation.duration = 500; // animation time, in ms
        animation.starttime = starttime; // specify the start time
        
        // specify the element to fade
        animation.firstElement = document.getElementById ('flip');

        // set the animation function
        animation.timer = setInterval ("animate();", 13);
	
        animation.from = animation.now;	// beginning opacity (not ness. 0)
	animation.to = 1.0; // final opacity
	
        animate(); // begin animation
        flipShown = true; // mark the flipper as animated
    }
}


/*
mouseexit() is the opposite of mousemove() in that it preps the preferences
flipper to disappear.  It adds the appropriate values to the animation data
structure and sets the animation in motion.
*/

function mouseexit (event) {
    if (flipShown) {
        // fade in the flip widget
	if (animation.timer != null) {
            clearInterval (animation.timer);
            animation.timer  = null;
	}
		
        var starttime = (new Date).getTime() - 13;
		
        animation.duration = 500;
        animation.starttime = starttime;
        animation.firstElement = document.getElementById ('flip');
        animation.timer = setInterval ("animate();", 13);
        animation.from = animation.now;
        animation.to = 0.0;
        animate();
        flipShown = false;
    }
}


/*
animate() performs the fade animation for the preferences flipper. It uses
the opacity CSS property to simulate a fade.
*/

function animate() {
    var T;
    var ease;
    var time = (new Date).getTime();
		
    T = limit_3(time-animation.starttime, 0, animation.duration);
	
    if (T >= animation.duration) {
        clearInterval (animation.timer);
        animation.timer = null;
        animation.now = animation.to;
    } else {
        ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
	animation.now = computeNextFloat (animation.from, animation.to, ease);
    }
    
    animation.firstElement.style.opacity = animation.now;
}


// these functions are utilities used by animate()
function limit_3 (a, b, c) {
    return a < b ? b : (a > c ? c : a);
}

function computeNextFloat (from, to, ease) {
    return from + (to - from) * ease;
}

// these functions are called when the info button itself receives onmouseover and onmouseout events

function enterflip(event) {
    document.getElementById('fliprollie').style.display = 'block';
}

function exitflip(event) {
    document.getElementById('fliprollie').style.display = 'none';
}
