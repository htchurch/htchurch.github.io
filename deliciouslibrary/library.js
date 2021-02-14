// library.js
// Copyright 2007 Delicious Monster Software

var mediaTypesToIconsNames = new Array();
mediaTypesToIconsNames['Albums'] = "music";
mediaTypesToIconsNames['Apparel'] = "apparel";
mediaTypesToIconsNames['Books'] = "books";
mediaTypesToIconsNames['Gadgets'] = "gadgets";
mediaTypesToIconsNames['iTunes Audiobooks'] = "itunesaudiobooks";
mediaTypesToIconsNames['iTunes Movies'] = "itunesmovies";
mediaTypesToIconsNames['iTunes Music'] = "itunesalbums";
mediaTypesToIconsNames['iTunes TV Shows'] = "itunesshows";
mediaTypesToIconsNames['Movies'] = "movies";
mediaTypesToIconsNames['Music'] = "music";
mediaTypesToIconsNames['Software'] = "software";
mediaTypesToIconsNames['Tools'] = "tools";
mediaTypesToIconsNames['Games'] = "toys";
mediaTypesToIconsNames['Videogames'] = "videogames";

function initialize() {
    setupDragging();
    window.onresize = adjustDetailsMargin;
}

function adjustDetailsMargin() {
    if (window.innerWidth > 980) {
        $("details").style.left = "50%";
        $("details").style.marginLeft = (window.innerWidth % 2 == 1) ? "-239px" : "-238px";
    } else {
        $("details").style.left = "0";
        $("details").style.marginLeft = "244px";
    }
}

function fillInMediaIcons() {
    var shelves = document.getElementsByClassName("shelf");
    for (var i = shelves.length - 1; i >= 0; i--) {
        var imageName = mediaTypesToIconsNames[shelves[i].innerHTML];
        if (imageName != null)
            shelves[i].innerHTML = "<img src='images/" + imageName + ".png' width='32' height='32' alt='' />" + shelves[i].innerHTML;
        else
            shelves[i].innerHTML = "<img src='images/yourshelf.png' width='32' height='32' alt='' />" + shelves[i].innerHTML;
    }
}

var detailsAnimator;
var detailsAnimatorIsDirty = true;
var selectedMedium = null;

function showDetails(element, event) {
    var medium = element.parentNode;
    if (selectedMedium == medium) {
        deselect();
        return;
    }
    
    $("title").innerHTML = medium.getElementsByClassName("title")[0].innerHTML;
    $("creator").innerHTML = medium.getElementsByClassName("creator")[0].innerHTML;
    $("rating").innerHTML = medium.getElementsByClassName("rating")[0].innerHTML;
    $("description").innerHTML = medium.getElementsByClassName("description")[0].innerHTML;
    
    refreshDetailsAnimator();
    detailsAnimator.seekTo(1);
    selectedMedium = medium;
    
    if (window.event) Event.stop(window.event);
    if (event) Event.stop(event);
}

var DEFAULT_DETAILS_HEIGHT = 180;

function refreshDetailsAnimator() {
    if (detailsAnimator && !detailsAnimatorIsDirty)
        return;
    
    var currentDetailsHeight = parseInt($("details").style.height);
    if (isNaN(currentDetailsHeight) || currentDetailsHeight == 0)
        currentDetailsHeight = DEFAULT_DETAILS_HEIGHT;
    
    var shouldResetState = (detailsAnimator != null);
    detailsAnimator = Animator.apply($("details"), new Array("height: 0", "height: " + currentDetailsHeight + "px"),  {interval: 10, duration: 200});
    if (shouldResetState) detailsAnimator.state = 1;
    detailsAnimatorIsDirty = false;
}

function setupDragging() {
    var DetailsDragObserver = Class.create();
    DetailsDragObserver.prototype = {
    initialize: function(dragElement, dragHandle) {
        this.dragElement = $(dragElement);
        this.dragHandle = dragHandle ? $(dragHandle) : this.dragElement;
        this.dragEventHandlerFunctionCache = new Array(this.dragEventHandler.bindAsEventListener(this), this.endDragEventHandler.bindAsEventListener(this));
        Event.observe(this.dragHandle, "mousedown", this.startDragEventHandler.bindAsEventListener(this));
    },
        
    startDragEventHandler: function(event) {
        // TODO: Lucas: Determine mouse offset, drag from that location
        Event.observe(window, "mousemove", this.dragEventHandlerFunctionCache[0]);
        Event.observe(window, "mouseup", this.dragEventHandlerFunctionCache[1]);
        Event.stop(event);
    },
        
    endDragEventHandler: function(event) {
        Event.stopObserving(window, "mousemove", this.dragEventHandlerFunctionCache[0]);
        Event.stopObserving(window, "mouseup", this.dragEventHandlerFunctionCache[1]);
        Event.stop(event);
    },
        
    dragEventHandler: function(event) {
        // TODO: Lucas: Cleaner separation between this object and the callbacks
        newDetailsHeight = Math.max(71, Math.min(self.innerHeight / 2, (self.innerHeight - event.clientY)));
        this.dragElement.style.height = newDetailsHeight + "px";
        $("description").style.height = (newDetailsHeight - 101) + "px";
        detailsAnimatorIsDirty = true;
        Event.stop(event);
    }
    };
    
    var dragObserver = new DetailsDragObserver("details", "drag_handle");
}

function deselect() {
    refreshDetailsAnimator();
    detailsAnimator.seekTo(0);
    selectedMedium = null;
    
    if (window.event) Event.stop(window.event);
}
