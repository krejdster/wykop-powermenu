// ==UserScript==
// @name         Wykop PowerMenu
// @description  Dodaje ikony w górnej części strony, aby ułatwić nawigację po Wykopie
// @version      2.1
// @released     2018-03-20
// @copyright    krejd
// @namespace    http://www.wykop.pl/*
// @match        *://www.wykop.pl/*
// @run-at       document-start
// @downloadURL  none
// ==/UserScript==

hideOriginalButtons();
injectPowerStyles();

/**
 * Add buttons and sections when top menu is loaded
*/
var poller = setInterval(function(){
    if(document.querySelector('div#nav .dropdown.right.m-hide') !== null) {
        clearInterval(poller);

        addPowerButtons();
        addPowerSections();
        updatePowerBadgesCount();
    }
}, 50);

/**
 * Bind events once jQuery is available in the scope
*/
window.onload = function() {
    bindReadNextNotificationEvent();
    bindReadNextTagEvent();
    bindReadNextPmOrShowInboxEvent();
    bindBadgesCheck();
    makePowerButtonsClickable();
};

// ######################
// #### Power Menu
// ######################

var flags = {
    canClickNextNotification: true,
    canClickNextTag: true
};

function injectPowerStyles() {

    (document.head || document.documentElement).insertAdjacentHTML('beforeend', `
        <style>

            /* Essentials */

            body.power-hide .menu-list {
                display:none !important;
            }

            div.dropdown.m-hide {
                width: 180px !important;
                margin-left: -140px !important;
            }

            div.dropdown.m-hide ul li {
                position: relative;
            }

            #powerButtonNextNotification:not(.not-active-yet),
            #powerButtonNextTag:not(.not-active-yet),
            #powerButtonAllTags {
                cursor: pointer;
            }

            /* Button styles */

            .power-button.not-active-yet {
                opacity: 0.15;
            }

            .power-button .power-button-circle {
                position: absolute;
                pointer-events: none;
                background: #FF5917;
                font-size: 0;
                display: block;
                padding: 1px;
                top: 25px;
                right: 4px;
                min-width: 10px;
                width: 10px;
                min-height: 10px;
                height: 10px;
                border-radius: 5px;
                overflow: hidden;
            }

            .power-button.no-notifications .power-button-count {
                display: none !important;
            }

            .power-button.no-notifications .power-button-circle {
                background: rgba(235, 85, 51, 0.25);
            }

            /* Section styles */

            .power-section .power-section-badge {
                position: absolute;
                top: calc(50% - 25%);
                right: 5px;
                width: 30px;
                margin: 0;
                padding: 4px 5px;
                border-radius: 5px;
                vertical-align: middle;
                font-size: 12px !important;
                line-height: 100%;
                text-align: center;
                background: #FF5917;
                color: #FFFFFF;
            }

            .power-section.no-notifications .power-section-badge {
                background: rgba(255,255,255,0.1);
            }
        </style>
    `);

}

function hideOriginalButtons() {

    (document.head || document.documentElement).insertAdjacentHTML('beforeend', `
        <style>
            li.notification.bell,
            li.notification.m-user:not(#powerButtonNextNotification),
            li.notification.m-tag:not(#powerButtonNextTag):not(#powerButtonAllTags)
            {
                display: none;
            }
        </style>
    `);

}

function updatePowerBadgesCount() {

    // Get numbers of notifications

    var pmCount            = document.querySelector('#pmNotificationsCount').innerHTML;
    var notificationsCount = document.querySelector('#notificationsCount').innerHTML;
    var tagsCount          = document.querySelector('#hashtagsNotificationsCount').innerHTML;

    pmCount                = pmCount ? +pmCount : 0;
    notificationsCount     = notificationsCount ? +notificationsCount : 0;
    tagsCount              = tagsCount ? +tagsCount : 0;
    var totalMessagesCount = pmCount + notificationsCount;

    // Update badges count (for buttons)

    document.querySelector('#powerButtonNextNotification .power-button-count').innerHTML = 
        (pmCount === 0 ? '-' : pmCount) +
        '/' +
        (notificationsCount === 0 ? '-' : notificationsCount);
    document.querySelector('#powerButtonNextTag .power-button-count').innerHTML = tagsCount;

    // Update badges count (for sections)

    document.querySelector('#powerSectionPrivateMessages .power-section-badge').innerHTML = pmCount;
    document.querySelector('#powerSectionNotifications .power-section-badge').innerHTML = notificationsCount;
    document.querySelector('#powerSectionTags .power-section-badge').innerHTML = tagsCount;

    // Update badges style (for buttons)

    if(totalMessagesCount === 0) _addClass('#powerButtonNextNotification', 'no-notifications');
    if(totalMessagesCount > 0) _removeClass('#powerButtonNextNotification', 'no-notifications');
    if(tagsCount === 0) _addClass('#powerButtonNextTag', 'no-notifications');
    if(tagsCount > 0) _removeClass('#powerButtonNextTag', 'no-notifications');
    if(tagsCount === 0) _addClass('#powerButtonAllTags', 'no-notifications');
    if(tagsCount > 0) _removeClass('#powerButtonAllTags', 'no-notifications');

    // Update badges style (for sections)

    if(pmCount === 0) _addClass('#powerSectionPrivateMessages', 'no-notifications');
    if(pmCount > 0) _removeClass('#powerSectionPrivateMessages', 'no-notifications');
    if(notificationsCount === 0) _addClass('#powerSectionNotifications', 'no-notifications');
    if(notificationsCount > 0) _removeClass('#powerSectionNotifications', 'no-notifications');
    if(tagsCount === 0) _addClass('#powerSectionTags', 'no-notifications');
    if(tagsCount > 0) _removeClass('#powerSectionTags', 'no-notifications');

}

function addPowerButtons() {

    // Find handler element

    var topBarSections      = document.body.querySelectorAll('div#nav ul.clearfix');
    var topBarSectionsNodes = topBarSections.length;
    var rightSection        = topBarSections[topBarSectionsNodes-1];
    var handlerEl           = rightSection.querySelector('li.notification.bell');

    // Append buttons

    handlerEl.insertAdjacentHTML('beforebegin', `
        <li id="powerButtonNextNotification" class="notification m-user power-button not-active-yet" title="Czytaj następną wiadomość prywatną lub powiadomienie" alt="Czytaj następną wiadomość prywatną lub powiadomienie">
            <a class="dropdown-show">
                <i class="fa fa-envelope"></i>
                <b class="power-button-count">&nbsp;</b>
            </a>
            <div class="notificationsContainer"></div>
        </li>
    `);

    handlerEl.insertAdjacentHTML('beforebegin', `
        <li id="powerButtonNextTag" class="notification m-tag power-button not-active-yet" title="Czytaj następny tag" alt="Czytaj następny tag">
            <a class="dropdown-show hashtag">
                <b class="power-button-count">&nbsp;</b>
                #
            </a>
            <div class="notificationsContainer"></div>
        </li>
    `);

    handlerEl.insertAdjacentHTML('beforebegin', `
        <li id="powerButtonAllTags" class="notification m-tag power-button" title="Pokaż 50 kolejnych nieprzeczytanych wpisów z tagów" alt="Pokaż 50 kolejnych nieprzeczytanych wpisów z tagów">
            <a class="dropdown-show hashtag" href="` + _getProtocol() + `//www.wykop.pl/powiadomienia/unreadtags/">
                <div class="power-button-circle">&nbsp;</div>
                #
            </a>
            <div class="notificationsContainer"></div>
        </li>
    `);

}

function addPowerSections() {

    var userMenuElements  = document.body.querySelectorAll('div.dropdown.m-hide ul li');
    var handlerEl         = userMenuElements[0];

    handlerEl.insertAdjacentHTML('afterend', `
        <li id="powerSectionTags" class="power-section" title="Pokaż tagi" alt="Pokaż tagi">
            <a href="` + _getProtocol() + `//www.wykop.pl/powiadomienia/tagi/" title="" class="ellipsis color-1">
                <i class="fa fa-tag"></i>
                <span><b>tagi</b></span>
                <b class="power-section-badge">&nbsp;</b>
            </a>
        </li>
    `);

    handlerEl.insertAdjacentHTML('afterend', `
        <li id="powerSectionNotifications" class="power-section" title="Powiadomienia" alt="Powiadomienia">
            <a href="` + _getProtocol() + `//www.wykop.pl/powiadomienia/do-mnie/" title="" class="ellipsis color-1">
                <i class="fa fa-bell"></i>
                <span><b>powiadomienia</b></span>
                <b class="power-section-badge">&nbsp;</b>
            </a>
        </li>
    `);

    handlerEl.insertAdjacentHTML('afterend', `
        <li id="powerSectionPrivateMessages" class="power-section" title="Skrzynka odbiorcza PM" alt="Skrzynka odbiorcza PM">
            <a href="` + _getProtocol() + `//www.wykop.pl/wiadomosc-prywatna/" title="" class="ellipsis color-1">
                <i class="fa fa-envelope"></i>
                <span><b>wiadomości</b></span>
                <b class="power-section-badge">&nbsp;</b>
            </a>
        </li>
    `);

}

function bindReadNextNotificationEvent() {

    $('body').on('click', '#powerButtonNextNotification', function(event) {
        event.preventDefault();

        // Lock event to make sure it doesn't loop infinitely

        if(!flags.canClickNextNotification) {
            return;
        }

        flags.canClickNextNotification = false;

        $('body').addClass('power-hide');

        // Click buttons to get ajax working as it
        // needs to scrape unread notification list

        $('.notification.m-user > a.ajax').trigger('click');
        $('.notification.bell > a.ajax').trigger('click');

        // Checks if ajax complete
        checkIfShownNote = setInterval(function() {
            if(jQuery.active === 0) {
                clearInterval(checkIfShownNote);
                flags.canClickNextNotification = true;
                $('body').trigger('click');

                // Prioritizes PMs over regular notifications

                var newNotifications = [];
                var oldNotifications = [];

                $('.notification.m-user .menu-list li.type-light-warning a').each(function(index,value) {
                    if($(this).attr('href').match(/wpis/i) || $(this).attr('href').match(/konwersacja/i) || $(this).attr('href').match(/comment/i)) {
                        var hashHref = $(this).attr('href');
                        newNotifications.push(hashHref);
                    }
                });

                $('.notification.bell .menu-list li.type-light-warning a').each(function(index,value) {
                    if($(this).attr('href').match(/wpis/i) || $(this).attr('href').match(/konwersacja/i) || $(this).attr('href').match(/comment/i)) {
                        var hashHref = $(this).attr('href');
                        newNotifications.push(hashHref);
                    }
                });

                $('.notification.bell .menu-list li a').each(function(index,value) {
                    if($(this).attr('href').match(/wpis/i) || $(this).attr('href').match(/konwersacja/i) || $(this).attr('href').match(/comment/i)) {
                        var hashHref = $(this).attr('href');
                        oldNotifications.push(hashHref);
                    }
                });

                if(newNotifications.length > 0) {
                    window.location.href = newNotifications[0];
                } else {
                    window.location.href = oldNotifications[0];
                }

                $('body').removeClass('power-hide');

            }
        }, 50);
    });

}

function bindReadNextPmOrShowInboxEvent() {

    $('body').on('click', '#powerSectionPrivateMessages', function(event) {
        event.preventDefault();

        // Lock event to make sure it doesn't loop infinitely

        if(!flags.canClickNextNotification) {
            return;
        }

        flags.canClickNextNotification = false;

        $('body').addClass('power-hide');

        // Click button to get latest PMs

        $('.notification.m-user > a.ajax').trigger('click');

        // Checks if ajax complete
        checkIfShownNote = setInterval(function() {
            if(jQuery.active === 0) {
                clearInterval(checkIfShownNote);
                flags.canClickNextNotification = true;
                $('body').trigger('click');

                var newPMs = [];

                $('.notification.m-user .menu-list li.type-light-warning a').each(function(index,value) {
                    if($(this).attr('href').match(/wpis/i) || $(this).attr('href').match(/konwersacja/i) || $(this).attr('href').match(/comment/i)) {
                        var hashHref = $(this).attr('href');
                        newPMs.push(hashHref);
                    }
                });

                if(newPMs.length === 0) {
                    window.location.href = $('#powerSectionPrivateMessages a').attr('href');
                } else {
                    window.location.href = newPMs[0];
                }
                $('body').removeClass('power-hide');

            }
        }, 50);
    });

}

function bindReadNextTagEvent() {

    $('body').on('click', '#powerButtonNextTag', function(event) {
        event.preventDefault();

        // Lock event to make sure it doesn't loop infinitely

        if(!flags.canClickNextTag) {
            return;
        }

        flags.canClickNextTag = false;

        $('body').addClass('power-hide');

        // Click button to get ajax working as it
        // needs to scrape unread notification list

        $('.notification.m-tag > a.ajax').trigger('click');

        // Checks if ajax complete
        checkIfShownNote = setInterval(function() {
            if(jQuery.active === 0) {
                clearInterval(checkIfShownNote);
                flags.canClickNextTag = true;
                $('body').trigger('click');

                $('.notification.m-tag .menu-list li:first a').each(function(index,value) {
                    if($(this).attr('href').match(/wpis\//i)) {
                        var hashHref = $(this).attr('href');
                        window.location.href = hashHref;
                    }
                });

                $('body').removeClass('power-hide');
            }
        }, 50);
    });

}

function bindBadgesCheck() {

    addXMLRequestCallback(function(xhr) {
        updatePowerBadgesCount();
    });

}

function makePowerButtonsClickable() {

    _removeClass('#powerButtonNextNotification', 'not-active-yet');
    _removeClass('#powerButtonNextTag', 'not-active-yet');

}

// ######################
// #### Helper functions
// ######################

/**
 * Source: https://stackoverflow.com/a/5202999
 */
function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push( callback );
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function(){
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            // call the native send()
            oldSend.apply(this, arguments);
        };
    }
}

function _getProtocol() {
    return window.location.protocol;
}

function _addClass(el, className) {
    el = document.body.querySelector(el);
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
}

function _removeClass(el, className) {
    el = document.body.querySelector(el);
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
}
