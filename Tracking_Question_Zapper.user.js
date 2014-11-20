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
// @version     1.1
// @grant       none
// ==/UserScript==

// From http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
// Fires the specified event type ('click'...) on the given element.
function eventFire(el, etype) {
  if (el.fireEvent) {
    (el.fireEvent('on' + etype));
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

// Gets the specified element from the DOM, and fires a click event on it.
// Returns false if no element matched, true otherwise.
function zapQuestion(selector) {
    var element = document.querySelector(selector);

    if (typeof element === 'undefined') {
        console.log("No matching element found in document.");
        return false;
    } else {
        console.log("Matching element found in document.");
        eventFire(element, 'click');
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
    return zapQuestion("div#alerte_tracking > a:nth-child(1)");
}

var knownSites = [
    { r: /^https?:\/\/.*google\..*/, f: google},
    { r: /^https?:\/\/.*google\..*/, f: youtube},
    { r: /^https?:\/\/.*slashdot\..*/, f: slashdot},
    { r: /^https?:\/\/.*youtube\..*/, f: youtube },
    { r: /^https?:\/\/.*lemonde\.fr/, f: lemonde }
];

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
