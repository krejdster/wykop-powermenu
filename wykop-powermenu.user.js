// ==UserScript==
// @name         Wykop PowerMenu
// @description  Wprowadza klikalne ikonki powiadomień i dodatkowe przycisku w menu.
// @version      3.3
// @released     2019-11-26
// @copyright    krejd
// @namespace    http://www.wykop.pl/*
// @match        *://www.wykop.pl/*
// @run-at       document-start
// @downloadURL  none
// ==/UserScript==

// ######################
// #### Initialize
// ######################

// Inject styles immediately

injectPowerStyles();

// Add buttons and sections as soon as top menu is loaded

let poller = setInterval(function () {
    if (document.querySelector('div#nav .dropdown.right.m-hide') !== null) {
        clearInterval(poller);

        addPowerButtons();
        addPowerSections();
        updatePowerBadgesCount();
    }
}, 50);

// Bind events when page is loaded

window.onload = function () {
    setTimeout(function() {
        bindButtonEvents('bell', '.bell', '#powerButtonNextNotification');
        bindButtonEvents('envelope', '.m-user', '#powerButtonNextPrivateMessage');
        bindButtonEvents('tag', '.m-tag', '#powerButtonNextTag');
        bindButtonEventsForAllTags();
        bindButtonEventsForAvatar();
        bindBadgesCheck();
        makePowerButtonsClickable();
    }, 60);
};

// ######################
// #### Addon state
// ######################

let debounceTime = 10000;

let addonState = {
    bell: {
        debounceIntervalHandler: null,
        flagIsInitialized: false,
        flagCanUpdate: true,
        links: []
    },
    envelope: {
        debounceIntervalHandler: null,
        flagIsInitialized: false,
        flagCanUpdate: true,
        links: []
    },
    tag: {
        debounceIntervalHandler: null,
        flagIsInitialized: false,
        flagCanUpdate: true,
        links: []
    }
};

// ######################
// #### CSS / DOM
// ######################

function injectPowerStyles() {

    (document.head || document.documentElement).insertAdjacentHTML('beforeend', `
        <style>

            /* Essentials */

            .force-display .notificationsContainer {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* Not active buttons */

            #powerButtonNextPrivateMessage:not(.not-active-yet),
            #powerButtonNextNotification:not(.not-active-yet),
            #powerButtonNextTag:not(.not-active-yet),
            #powerButtonAllTags {
                cursor: pointer;
            }

            /* Hide original buttons */

            li.notification.bell a.dropdown-show.ajax,
            li.notification.m-user a.dropdown-show.ajax,
            li.notification.m-tag a.dropdown-show.ajax
            {
                display: none;
                pointer-events: none;
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

            .power-button-count {
                pointer-events: none;
            }

            .power-button.no-notifications .power-button-count {
                display: none !important;
            }

            .power-button.no-notifications .power-button-circle {
                background: rgba(235, 85, 51, 0.25);
            }

            /* Section styles */

            li.notification .dropdown.right {
                margin-left: -260px
            }

            div.dropdown.m-hide {
                width: 180px !important;
                margin-left: -140px !important;
            }

            div.dropdown.m-hide ul li {
                position: relative;
            }

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

function addPowerButtons() {

    // Find handler element

    let bellContainer = document.body.querySelector('.notification.bell');
    let envelopeContainer = document.body.querySelector('.notification.m-user');
    let tagContainer = document.body.querySelector('.notification.m-tag');

    // Append buttons

    bellContainer.insertAdjacentHTML('beforeend', `
        <a id="powerButtonNextNotification" class="dropdown-show power-button not-active-yet" title="Czytaj następne powiadomienie" alt="Czytaj następne powiadomienie">
            <img src="/img/w4/ico-bell-svg.svg" alt="">
            <b class="power-button-count">&nbsp;</b>
        </a>
    `);

    envelopeContainer.insertAdjacentHTML('beforeend', `
        <a id="powerButtonNextPrivateMessage" class="dropdown-show power-button not-active-yet" title="Czytaj następną wiadomość prywatną" alt="Czytaj następną wiadomość prywatną">
            <i class="fa fa-envelope"></i>
            <b class="power-button-count">&nbsp;</b>
        </a>
    `);

    tagContainer.insertAdjacentHTML('beforeend', `
        <a id="powerButtonNextTag" class="dropdown-show hashtag power-button not-active-yet" title="Czytaj następny wpis z tagów" alt="Czytaj następny wpis z tagów">
            <b class="power-button-count">&nbsp;</b>
            #
        </a>
    `);

    tagContainer.insertAdjacentHTML('beforeend', `
        <a id="powerButtonAllTags" class="dropdown-show hashtag power-button not-active-yet" href="#" title="Pokaż 50 kolejnych nieprzeczytanych wpisów z tagów" alt="Pokaż 50 kolejnych nieprzeczytanych wpisów z tagów">
            <div class="power-button-circle">&nbsp;</div>
            #
        </a>
    `);

}

function addPowerSections() {

    let handlerEl = document.body.querySelectorAll('div.dropdown.m-hide ul li')[0];

    handlerEl.insertAdjacentHTML('beforeend', `
        <li id="powerSectionNotifications" class="power-section" title="Panel powiadomień" alt="Panel powiadomień">
            <a href="` + _getProtocol() + `//www.wykop.pl/powiadomienia/do-mnie/" title="" class="ellipsis color-1">
                <i class="fa fa-bell-o"></i>
                <span><b>powiadomienia</b></span>
                <b class="power-section-badge">&nbsp;</b>
            </a>
        </li>

        <li id="powerSectionPrivateMessages" class="power-section" title="Skrzynka odbiorcza PM" alt="Skrzynka odbiorcza PM">
            <a href="` + _getProtocol() + `//www.wykop.pl/wiadomosc-prywatna/" title="" class="ellipsis color-1">
                <i class="fa fa-envelope"></i>
                <span><b>wiadomości</b></span>
                <b class="power-section-badge">&nbsp;</b>
            </a>
        </li>

        <li id="powerSectionTags" class="power-section" title="Panel powiadomień z tagów" alt="Panel powiadomień z tagów">
            <a href="` + _getProtocol() + `//www.wykop.pl/powiadomienia/tagi/" title="" class="ellipsis color-1">
                <i class="fa fa-tag"></i>
                <span><b>tagi</b></span>
                <b class="power-section-badge">&nbsp;</b>
            </a>
        </li>
    `);

}

/**
 * Make power buttons clickable
 *
 * Once document is loaded, removes opacity from buttons
 * to indicate that user can click them from now on.
 *
 * This is necessary because notifications are not loaded
 * with the DOM. Server request is necessary to get them
 * for particular section.
*/
function makePowerButtonsClickable() {

    _removeClass('#powerButtonNextNotification', 'not-active-yet');
    _removeClass('#powerButtonNextPrivateMessage', 'not-active-yet');
    _removeClass('#powerButtonNextTag', 'not-active-yet');
    _removeClass('#powerButtonAllTags', 'not-active-yet');

}

/**
 * Update power badges count
 *
 * Updates the badges for all notifications and applies
 * proper CSS rules based on its number.
 *
 * This function is injected to each XHR request.
*/
function updatePowerBadgesCount() {

    // Get numbers of notifications

    let bellCount = document.querySelector('#notificationsCount').innerHTML;
    let envelopeCount = document.querySelector('#pmNotificationsCount').innerHTML;
    let tagCount = document.querySelector('#hashtagsNotificationsCount').innerHTML;

    envelopeCount = envelopeCount ? +envelopeCount : 0;
    bellCount = bellCount ? +bellCount : 0;
    tagCount = tagCount ? +tagCount : 0;

    // Update badges count (for buttons)

    document.querySelector('#powerButtonNextNotification .power-button-count').innerHTML = bellCount;
    document.querySelector('#powerButtonNextPrivateMessage .power-button-count').innerHTML = envelopeCount;
    document.querySelector('#powerButtonNextTag .power-button-count').innerHTML = tagCount;

    // Update badges count (for sections)

    document.querySelector('#powerSectionNotifications .power-section-badge').innerHTML = bellCount;
    document.querySelector('#powerSectionPrivateMessages .power-section-badge').innerHTML = envelopeCount;
    document.querySelector('#powerSectionTags .power-section-badge').innerHTML = tagCount;

    // Update badges style (for buttons)

    if (bellCount === 0) _addClass('#powerButtonNextNotification', 'no-notifications');
    if (bellCount > 0) _removeClass('#powerButtonNextNotification', 'no-notifications');
    if (envelopeCount === 0) _addClass('#powerButtonNextPrivateMessage', 'no-notifications');
    if (envelopeCount > 0) _removeClass('#powerButtonNextPrivateMessage', 'no-notifications');
    if (tagCount === 0) _addClass('#powerButtonNextTag', 'no-notifications');
    if (tagCount > 0) _removeClass('#powerButtonNextTag', 'no-notifications');
    if (tagCount === 0) _addClass('#powerButtonAllTags', 'no-notifications');
    if (tagCount > 0) _removeClass('#powerButtonAllTags', 'no-notifications');

    // Update badges style (for sections)

    if (bellCount === 0) _addClass('#powerSectionNotifications', 'no-notifications');
    if (bellCount > 0) _removeClass('#powerSectionNotifications', 'no-notifications');
    if (envelopeCount === 0) _addClass('#powerSectionPrivateMessages', 'no-notifications');
    if (envelopeCount > 0) _removeClass('#powerSectionPrivateMessages', 'no-notifications');
    if (tagCount === 0) _addClass('#powerSectionTags', 'no-notifications');
    if (tagCount > 0) _removeClass('#powerSectionTags', 'no-notifications');

}

// ######################
// #### Logic
// ######################

/**
 * Bind button events
 *
 * Binds all necessary events to each new power button.
 *
 * @param {String} sourceId Internal name for the notification type
 * @param {String} sourceClass Class of the original button
 * @param {String} powerButtonId ID of the new button
*/
function bindButtonEvents(sourceId, sourceClass, powerButtonId) {

    // Mouse enter

    $('body').on('mouseenter', powerButtonId, function (event) {
        event.preventDefault();

        $('.notification' + sourceClass).addClass('force-display');

        if (!addonState[sourceId].flagCanUpdate) {
            return;
        }

        addonState[sourceId].flagCanUpdate = false;

        _RequestNotificationRefresh(sourceId, sourceClass)
            .then(function () {
                addonState[sourceId].links = _parseLinksFromNotificationContainer(sourceClass);
                addonState[sourceId].flagIsInitialized = true;

                setTimeout(function () {
                    addonState[sourceId].flagCanUpdate = true;
                }, debounceTime);
            });

    });

    // Mouse leave

    $('body').on('mouseleave', sourceClass, function (event) {
        $('.notification' + sourceClass).removeClass('force-display');
    });

    // Click

    $('body').on('click', powerButtonId, function (event) {

        event.preventDefault();

        // Check if debounce interval is running.
        // If so, try to run this code again once it's done.

        if (addonState[sourceId].debounceIntervalHandler !== null) {
            setTimeout(function () {
                $(powerButtonId).trigger('click');
            }, 100);
            return;
        }

        // Notifications were already downloaded but user has no data.
        // This should only happen when user has zero notificaitons
        // of specific type.

        if (addonState[sourceId].flagIsInitialized && addonState[sourceId].links.length === 0) {
            alert('Nie masz żadnych powiadomień.');
        }

        // Notifications were already downloaded and user has some data.
        // Redirects user to notification.

        if (addonState[sourceId].flagIsInitialized && addonState[sourceId].links.length > 0) {
            window.location = addonState[sourceId].links[0].url;
        }

        // Notifications were not downloaded yet.
        // By default, all notifications should be downloaded
        // as soon as mouse enters button (mouseenter event).
        // This is here just in case these were not downloaded
        // for some reason (weird browser event handling maybe?)

        if (!addonState[sourceId].flagIsInitialized) {
            _RequestNotificationRefresh(sourceId, sourceClass)
                .then(function () {
                    addonState[sourceId].links = _parseLinksFromNotificationContainer(sourceClass);
                    addonState[sourceId].flagIsInitialized = true;

                    if (addonState[sourceId].links.length === 0) {
                        alert('Nie masz żadnych powiadomień');
                    } else {
                        window.location = addonState[sourceId].links[0].url;
                    }

                });
        }

    });

}

/**
 * Bind button events for All Tags
 *
 * Redirects user to a special page which lists 50 latest
 * and unread entries of followed tags.
*/
function bindButtonEventsForAllTags() {

    // Click

    $('body').on('click', '#powerButtonAllTags', function (event) {
        window.location = _getProtocol() + '//www.wykop.pl/powiadomienia/unreadtags/';
    });

}

/**
 * Bind button events for Avatar
 *
 * Brings back the old way avatar button worked.
 * When clicked, simply redirects user to his profile.
*/
function bindButtonEventsForAvatar() {

    let avatarButtonClass = '.logged-user .dropdown-show';

    // Click

    $('body').on('click', avatarButtonClass, function (event) {
        event.preventDefault();
        window.location = $(this).attr('href');
    });

    // Mouse enter

    $('body').on('mouseenter', avatarButtonClass, function (event) {
        event.preventDefault();
        $(avatarButtonClass).addClass('show-next-drop');
    });

    // Mouse leave

    $('body').on('mouseleave', avatarButtonClass, function (event) {
        $(avatarButtonClass).removeClass('show-next-drop');
    });

}

/**
 * Bind badges check
 *
 * Binds additional code to each XHR request.
*/
function bindBadgesCheck() {

    addXMLRequestCallback(function () {
        updatePowerBadgesCount();
    });

}

/**
 * Request notification refresh
 *
 * Wraps tricky method to check if there are new notifications
 * in a simple promise.
 *
 * @private
*/
function _RequestNotificationRefresh(source, sourceClass) {

    let sourceElement = '.notification' + sourceClass + ' > a.ajax';

    return new Promise(function (resolve) {

        $(sourceElement).trigger('click');

        addonState[source].debounceIntervalHandler = setInterval(function () {
            if (jQuery.active === 0) {
                clearInterval(addonState[source].debounceIntervalHandler);
                addonState[source].debounceIntervalHandler = null;
                updatePowerBadgesCount();
                resolve();
            }
        }, 50);
    });

}

/**
 * Parse links from notification container
 *
 * @private
*/
function _parseLinksFromNotificationContainer(sourceClass) {

    let sourceElement = '.notification' + sourceClass + ' .menu-list li:not(.buttons) a';

    let links = [];

    $(sourceElement).each(function (index, value) {
        let href = $(this).attr('href');
        if (href.match(/(wpis|link)\//i) || href.match(/wiadomosc-prywatna/i)) {
            links.push({
                url: $(this).attr('href'),
                isNew: !!$(this).closest('li').hasClass('type-light-warning')
            });
        }
    });

    return links;

}

// ######################
// #### Helpers
// ######################

/**
 * Source: https://stackoverflow.com/a/5202999
 */
function addXMLRequestCallback(callback) {
    let oldSend, i;
    if (XMLHttpRequest.callbacks) {
        // we've already overridden send() so just add the callback
        XMLHttpRequest.callbacks.push(callback);
    } else {
        // create a callback queue
        XMLHttpRequest.callbacks = [callback];
        // store the native send()
        oldSend = XMLHttpRequest.prototype.send;
        // override the native send()
        XMLHttpRequest.prototype.send = function () {
            // process the callback queue
            // the xhr instance is passed into each callback but seems pretty useless
            // you can't tell what its destination is or call abort() without an error
            // so only really good for logging that a request has happened
            // I could be wrong, I hope so...
            // EDIT: I suppose you could override the onreadystatechange handler though
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
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
