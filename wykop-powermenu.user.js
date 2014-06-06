// ==UserScript==
// @name         Wykop PowerMenu
// @description  Dodaje ikony w górnej części strony, aby ułatwić nawigację po Wykopie
// @version      0.5
// @released     2014-06-06
// @copyright    krejd
// @namespace    http://www.wykop.pl/*
// @match        http://www.wykop.pl/*
// @downloadURL  none
// ==/UserScript==

// Goes to next unread tag
$('body').on('click', '#nextTag', function(event) {
    event.preventDefault();

    // Dblclick button to get ajax working as
    // it needs to scrape unread notification urls
    $('body').append('<style id="niewidacheheszki">.menu-list { display:none !important; }</style>');
    $('.notification.m-hide > a.ajax').trigger('click');

    // Checks if ajax complete
    checkIfShownNote = setInterval(function() {
        if(jQuery.active == 0) {
            clearInterval(checkIfShownNote);
            $('body').trigger('click');

            $('.notification.m-hide .menu-list li:first a').each(function(index,value) {
                if($(this).attr('href').match(/wpis/i)) {
                    hashHref = $(this).attr('href');
                    window.location.href = hashHref;
                }
            });
            
            $('#niewidacheheszki').remove();
        }
    }, 50);
});

// Goes to next unread notification
$('body').on('click', '#nextNote', function(event) {
    event.preventDefault();

    // Dblclick button to get ajax working as
    // it needs to scrape unread notification urls
    $('body').append('<style id="niewidacheheszki">.menu-list { display:none !important; }</style>');
    $('.notification.m-user > a.ajax').trigger('click');

    // Checks if ajax complete
    checkIfShownNote = setInterval(function() {
        if(jQuery.active == 0) {
            clearInterval(checkIfShownNote);
            $('body').trigger('click');

            $('.notification.m-user .menu-list li:first a').each(function(index,value) {
                if($(this).attr('href').match(/wpis/i) || $(this).attr('href').match(/konwersacja/i)) {
                    hashHref = $(this).attr('href');
                    window.location.href = hashHref;
                }
            });

            $('#niewidacheheszki').remove();
        }
    }, 50);
});

// Append new buttons to Wykop interface
// Append new buttons to Wykop interface
// Append new buttons to Wykop interface

$('div#nav ul.clearfix:last > li:nth-child(2)').after($('<li/>', {
    id: 'nextNote',
    html: '<a class="dropdown-show" href="/powiadomienia/nastepne-powiadomienie/"><i class="fa fa-envelope"></i><b class="" id="hashtagsNotificationsCount" style="background:#FF5917; font-size:0; display:block; padding:1px; top:22px; right:20px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b></a><div class="notificationsContainer"></div>',
    class: "notification m-user",
    title: "Czytaj następne powiadomienie",
    alt: "Czytaj następne powiadomienie"
}));

$('div#nav ul.clearfix:last > li:nth-child(4)').after($('<li/>', {
    id: 'allTags',
    html: '<a class="dropdown-show hashtag" href="http://www.wykop.pl/powiadomienia/unreadtags/"><b class="" id="hashtagsNotificationsCount" style="background:#924396; font-size:0; display:block; padding:1px; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-hide",
    title: "Pokaż nieprzeczytane wpisy z tagów",
    alt: "Pokaż nieprzeczytane wpisy z tagów"
}));

$('div#nav ul.clearfix:last > li:nth-child(5)').after($('<li/>', {
    id: 'nextTag',
    html: '<a class="dropdown-show hashtag" href="/tag/nastepny-tag/"><b class="" id="hashtagsNotificationsCount" style="background:#FF5917; font-size:0; display:block; padding:1px; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-hide",
    title: "Czytaj następny tag",
    alt: "Czytaj następny tag"
}));