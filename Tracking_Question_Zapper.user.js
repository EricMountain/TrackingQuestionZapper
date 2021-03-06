// ==UserScript==
// @name        Tracking Question Zapper
// @namespace   https://github.com/EricMountain/TrackingQuestionZapper.git
// @description We know we're tracked.  Answer EU law tracking/cookie question automatically.
// @include     /^https?://.*google\..*$/
// @include     https://google.tld/*
// @include     https://www.google.tld/*
// @include     http://slashdot.org/*
// @include     http://*.slashdot.org/*
// @include     http*://youtube.com/*
// @include     http*://*.youtube.com/*
// @include     http*://lemonde.fr/*
// @include     http*://*.lemonde.fr/*
// @include     http*://techradar.com/*
// @include     http*://*.techradar.com/*
// @include     http*://sourceforge.net/*
// @include     http*://*.sourceforge.net/*
// @include     http*://orange.fr/*
// @include     http*://*.orange.fr/*
// @version     1.8
// @grant       none
// ==/UserScript==

// From http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
// Fires the specified event type ('click'...) on the given element.
function eventFire(el, etype) {
    console.log('eventFire', el, etype);
    if (el.fireEvent) {
        (el.fireEvent('on' + etype));
        console.log('fireEvent of type ', etype, 'triggered on', el);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
        console.log('dispatched', etype, 'event to', evObj);
    }
}

// Gets the specified element from the DOM, and fires a click event on it.
// Returns false if no element matched, true otherwise.
function zapQuestion(selector) {
    var element = document.querySelector(selector);

    console.debug('Search result:', element);

    if (element === null) {
        console.debug("No matching element found in document:", selector);
        return false;
    } else {
        console.debug("Matching element found in document:", selector);
        eventFire(element, 'click');
        return true;
    }
}

// Click dispatch method doesn't seem to work on cases where addEvent()
// was used to register the click handler.  So just forcibly remove the
// offending block.
function zapElement(id) {
    var element = document.getElementById(id);

    console.debug('Search result:', element);

    if (element === null) {
        console.debug("No matching element found in document:", id);
        return false;
    } else {
        console.debug("Matching element found in document:", id);
        element.parentNode.removeChild(element);
        return true;
    }
}

function google() {
    return zapQuestion("#epb-ok");
}

function slashdot() {
    return zapQuestion("div.container > div.textcont > p > a.btn");
}

function youtube() {
    return zapQuestion("div.cookie-alert > div.yt-alert-buttons > button.yt-uix-button");
}

function lemonde() {
    return zapElement("alerte_tracking");
}

function orange() {
    return zapQuestion("o-cookie");
}

function techradar() {
    return zapElement("fp_cookieMessageContainer");
}

var knownSites = [
    { r: /^https?:\/\/.*google\..*/, f: google},
    { r: /^https?:\/\/.*google\..*/, f: youtube},
    { r: /^https?:\/\/.*slashdot\..*/, f: slashdot},
    { r: /^https?:\/\/.*sourceforge\..*/, f: slashdot},
    { r: /^https?:\/\/.*youtube\..*/, f: youtube },
    { r: /^https?:\/\/.*lemonde\.fr/, f: lemonde },
    { r: /^https?:\/\/.*orange\.fr/, f: orange },
    { r: /^https?:\/\/.*techradar\.com/, f: techradar }
];

setTimeout(function () {
    knownSites.every(function(element, index, array) {
        console.log('Test:', location.href, element, index);
        if (element.r.test(location.href)) {
            console.log('URL matched rule.');

            // Some sites (e.g. Youtube using Google accounts) match one
            // URL, but need the question handling of another site.  So we
            // don't stop trying to match unless the selector itself matches
            // an element of the document.

            return !element.f();
        } else {
            console.log('URL didn\'t match rule.');
            return true;
        }
    });
}, 50);
