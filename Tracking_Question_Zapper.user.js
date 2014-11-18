// ==UserScript==
// @name        Tracking Question Zapper
// @namespace   https://github.com/EricMountain/TrackingQuestionZapper.git
// @description We know we're tracked.  Answer EU law tracking/cookie question automatically.
// @include     /^https?://.*google\..*$/
// @include     https://www.google.*
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

var okButton = document.querySelector("#epb-ok");
eventFire(okButton, 'click');

