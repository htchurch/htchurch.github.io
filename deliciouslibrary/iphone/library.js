// library.js
// Copyright 2007 Delicious Monster Software

if (!!navigator.userAgent.match(/iP*.*Mobile.*Safari/)) {
    addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false);
    window.onorientationchange = adjustPadding;
} else
    window.onresize = adjustPadding;

function hideURLbar() {
    window.scrollTo(0, 1);
}

function adjustPadding() {
    var paddingSize = ((window.innerWidth - (Math.floor(window.innerWidth / 115.0) * 115.0)) / 2) - 14.0;
    $("mediatable").style.padding = "0 " + paddingSize + "px";
}

var selectedMedium = null;
var detailsVisible = false;

function showDetails(element, event) {
    var medium = element.parentNode.parentNode;
    if (selectedMedium == medium) {
        deselect();
        return;
    }
    
    $("detailstitle").innerHTML = medium.getElementsByClassName("title")[0].innerHTML;
    $("detailscreator").innerHTML = medium.getElementsByClassName("creator")[0].innerHTML;
    $("detailsbody").innerHTML = medium.getElementsByClassName("description")[0].innerHTML;
    $("detailscover").innerHTML = medium.getElementsByClassName("cover")[0].innerHTML;
    $("searchinsideanchor").setAttribute("href", "http://www.amazon.com/gp/reader/" + medium.getElementsByClassName("asin")[0].innerText);
    
    if (!detailsVisible) {
        $("details").style.display = "block";
        $("details").style.top = document.body.clientHeight + "px";
        $("details").style.opacity = 1.0;
    }
    $("details").style.top = (window.pageYOffset + 20) + "px";
    selectedMedium = medium;
    detailsVisible = true;
}

var displayInterval = null;

function hideDetails()
{
    displayInterval = setInterval(function() {$("details").style.display = "none"; clearInterval(displayInterval);}, 500);
    new Animator({interval:25, duration:500}).addSubject(new CSSStyleSubject($("details"), "opacity: 0.0")).play();
    selectedMedium = null;
    detailsVisible = false;
}
