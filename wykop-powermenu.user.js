// ==UserScript==
// @name         Wykop PowerMenu
// @description  Dodaje ikony w górnej części strony, aby ułatwić nawigację po Wykopie
// @version      1.3
// @released     2018-03-16
// @copyright    krejd
// @namespace    http://www.wykop.pl/*
// @match        *://www.wykop.pl/*
// @downloadURL  none
// ==/UserScript==

// Checks protocol
var wykopProtocol = window.location.protocol;

// Goes to next unread tag
$('body').on('click', '#nextTag', function(event) {
    event.preventDefault();

    // Dblclick button to get ajax working as
    // it needs to scrape unread notification urls
    $('body').append('<style id="niewidacheheszki">.menu-list { display:none !important; }</style>');
    $('.notification.m-tag > a.ajax').trigger('click');

    // Checks if ajax complete
    checkIfShownNote = setInterval(function() {
        if(jQuery.active === 0) {
            clearInterval(checkIfShownNote);
            $('body').trigger('click');

            $('.notification.m-tag .menu-list li:first a').each(function(index,value) {
                if($(this).attr('href').match(/wpis/i)) {
                    var hashHref = $(this).attr('href');
                    window.location.href = hashHref;
                }
            });

            $('#niewidacheheszki').remove();
        }
    }, 50);
});

// Goes to next unread notification or PM
$('body').on('click', '#nextNote', function(event) {
    event.preventDefault();

    // Dblclick button to get ajax working as
    // it needs to scrape unread notification urls
    $('body').append('<style id="niewidacheheszki">.menu-list { display:none !important; }</style>');
    $('.notification.m-user > a.ajax').trigger('click');
    $('.notification.bell > a.ajax').trigger('click');

    // Checks if ajax complete
    checkIfShownNote = setInterval(function() {
        if(jQuery.active === 0) {
            clearInterval(checkIfShownNote);

            $('body').trigger('click');

            // Prioritizes PMs over regular notifications

            var newNotifications = [];

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

            if(newNotifications.length > 0) {
                window.location.href = newNotifications[0];
            } else {
                alert('Nie masz żadnych nowych wiadomości prywatnych ani powiadomień.');
            }

            $('#niewidacheheszki').remove();
        }
    }, 50);
});

// Append separators and new buttons to Wykop interface
// Append separators and new buttons to Wykop interface
// Append separators and new buttons to Wykop interface

$('div#nav ul.clearfix:last > li.notification.bell').before($('<li/>', {
    style: 'width:2px; height:50px; background:rgba(0, 0, 0, 0.15);'
}));

$('div#nav ul.clearfix:last > li.notification.bell').before($('<li/>', {
    id: 'nextNote',
    html: '<a class="dropdown-show" href="'+wykopProtocol+'//www.wykop.pl/powiadomienia/do-mnie/"><i class="fa fa-envelope"></i><b class="" id="hashtagsNotificationsCount" style="background:#FF5917; font-size:0; display:block; padding:1px; top:22px; right:20px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b></a><div class="notificationsContainer"></div>',
    class: "notification m-user krejd-nextnotification",
    title: "Czytaj następne powiadomienie lub prywatną wiadomość",
    alt: "Czytaj następne powiadomienie"
}));

$('div#nav ul.clearfix:last > li.notification.bell').before($('<li/>', {
    id: 'nextTag',
    html: '<a class="dropdown-show hashtag" href="'+wykopProtocol+'//www.wykop.pl/powiadomienia/tagi/"><b class="" id="hashtagsNotificationsCount" style="background:#FF5917; font-size:0; display:block; padding:1px; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag krejd-nexttag",
    title: "Czytaj następny tag",
    alt: "Czytaj następny tag"
}));

$('div#nav ul.clearfix:last > li.notification.bell').before($('<li/>', {
    id: 'allTags',
    html: '<a class="dropdown-show hashtag" href="'+wykopProtocol+'//www.wykop.pl/powiadomienia/unreadtags/"><b class="" id="hashtagsNotificationsCount" style="background:#924396; font-size:0; display:block; padding:1px; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag krejd-alltags",
    title: "Pokaż nieprzeczytane wpisy z tagów",
    alt: "Pokaż nieprzeczytane wpisy z tagów"
}));

$('div#nav ul.clearfix:last > li.notification.bell').before($('<li/>', {
    style: 'width:2px; height:50px; background:rgba(0, 0, 0, 0.15);'
}));
