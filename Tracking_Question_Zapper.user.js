// ==UserScript==
// @name        Tracking Question Zapper
// @namespace   https://github.com/EricMountain/TrackingQuestionZapper.git
// @description We know we're tracked.  Answer EU law tracking/cookie question automatically.
// @include     /^https?://.*google\..*$/
// @include     https://google.tld/*
// @include     https://www.google.tld/*
// @include     http://slashdot.org/*
// @include     http://*.slashdot.org/*
// @version     1
// @grant       none
// ==/UserScript==

// From http://stackoverflow.com/questions/2705583/how-to-simulate-a-click-with-javascript
function eventFire(el, etype){
  if (el.fireEvent) {
    (el.fireEvent('on' + etype));
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function google() {
    var okButton = document.querySelector("#epb-ok");
    if (typeof okButton !== 'undefined') {
        eventFire(okButton, 'click');
    }
}

function slashdot() {
    var okButton = document.querySelector("div.container > div.textcont > p > a.btn");
    if (typeof okButton !== 'undefined') {
        eventFire(okButton, 'click');
    }
}

var knownSites = [
    { r: /^https?:\/\/.*google\..*/, f: google},
    { r: /^https?:\/\/.*slashdot\..*/, f: slashdot}
];

knownSites.every(function(element, index, array) {
    console.log('Test:', location.href, element, index);
    if (element.r.test(location.href)) {
        console.log('Matched.');
        element.f();
        return false;
    } else {
        console.log('Didn\'t match.');
        return true;
    }
});

