$('body').on('input', 'textarea#boxChat', function () {
    if ($('#frameListMsg').height()) {
        $(this).outerHeight(38).outerHeight(this.scrollHeight);
        $('#frameListMsg').attr('box-change-msg', $(this).height());
        $('#frameListMsg').trigger('changeBoxMsg');
    }
});

// add listen trigger changeBoxMsg
$('body').on('changeBoxMsg', '#frameListMsg', function () {
    var minHeightFrameListMsg = getMinHeightFrameListMsg();
    $(this).css({'min-height': minHeightFrameListMsg, 'height': minHeightFrameListMsg});

    // thay chieu cao box chat ....
    // if ($('#frameListMsg').attr('box-change-msg') > $('#frameListMsg').attr('box-raw-msg'))
    //     $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
});

function getMinHeightFrameListMsg() {
    let outerHeightParticipant = $("#group-participant").hasClass('display-show') ? $("#group-participant").outerHeight() : 0;
    return $(".content").outerHeight() - $(".contact-profile").outerHeight() - outerHeightParticipant - $("#messageInput").outerHeight() - 1;
}

function activeListContact(channelId) {
    $('#contacts li.contact').removeClass('active');
    $('[channel="status.' + channelId + '"]').closest('li').addClass('active');
}

$("body").on('click', '#user-status-current', function () {
    $("#status-options").toggleClass("active");
    $(this).toggleClass("status-hover");
});

$(document).click(function (event) {
    // status
    if (!$(event.target).closest('#user-status-current').length) {
        if ($('#status-options').is(":visible")) {
            $('#status-options').removeClass('active');
        }
    }

    //
    if (!$(event.target).closest('#profile').length) {
        if ($('#profile').hasClass('expanded')) {
            $('#profile').removeClass('expanded');
            $("#contacts").toggleClass("expanded");
        }
    }

    //
    if (!$(event.target).closest('#list-your-friend').length) {
        if (!$(event.target).closest('.contact-list').length && !$(event.target).closest('.name-contact').length) {
            if ($('#list-your-friend').css('display') === 'block') {
                $('#list-your-friend').css({display: 'none'});
                $('.search-results-contacts .box-action-friend').remove();
            }
        }
    }
});

$("body").on('click', '.action-friend .cancel', function (event) {
    $('#list-your-friend').css({display: 'none'});
    $('.search-results-contacts .box-action-friend').remove();
});

$("body").on('click', '.expand-button', function (event) {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
    event.stopPropagation();
});

$("body").on('click', '#extend-participant', function () {
    if ($(this).hasClass('cursor')) {
        $("#frameListMsg").css({"float": "left"});
        $("#group-participant").toggleClass('display-show');
        $(this).find('i:first-child').toggleClass('fa-minus');
        $('#frameListMsg').trigger('changeBoxMsg');
    }
});

