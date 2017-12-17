$('body').on('input', 'textarea#boxChat', function () {
    $(this).outerHeight(38).outerHeight(this.scrollHeight);
    $('#frameListMsg').attr('box-change-msg', $(this).height());
    $('#frameListMsg').trigger('changeBoxMsg');
});

// add listen trigger changeBoxMsg
$('body').on('changeBoxMsg', '#frameListMsg', function () {
    var minHeightFrameListMsg = getMinHeightFrameListMsg();
    $(this).css({'min-height': minHeightFrameListMsg, 'height': minHeightFrameListMsg});

    if ($('#frameListMsg').attr('box-change-msg') > $('#frameListMsg').attr('box-raw-msg'))
        $("#frameListMsg").animate({scrollTop: getMinHeightFrameListMsg()}, 500);
});


function getMinHeightFrameListMsg() {
    let outerHeightParticipant = $("#group-participant").hasClass('display-show') ? $("#group-participant").outerHeight() : 0;
    return $(".content").outerHeight() - $(".contact-profile").outerHeight() - outerHeightParticipant - $("#messageInput").outerHeight() - 1;
}

$("body").on('click', '#user-status-current', function () {
    $("#status-options").toggleClass("active");
    $(this).toggleClass("status-hover");
});

$("body").on('click', '.expand-button', function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

$("body").on('click', '#extend-participant', function () {
    if ($(this).hasClass('cursor')) {
        $("#group-participant").toggleClass('display-show');
        $(this).find('i:first-child').toggleClass('fa-minus');
        $('#frameListMsg').trigger('changeBoxMsg');
    }
});

$('body').on('click', '.show-info-participants', function () {
    $('.show-info-participants').removeClass('check-participant');
    $(this).addClass('check-participant');
})