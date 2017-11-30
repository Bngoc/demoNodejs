$('body').on('click', '#status-options .change-status', function () {

    var dataRequest = {
        url: $(this).attr('data-url'),
        data: {status: $(this).attr('data-value'), _method: 'post'}
    };

    callDataJS(dataRequest, function (result) {
        // if (result) {
        //     if (result.validate) {
        //         result.validate.forEach(function (val) {
        //             console.log(val);
        //             $('input[name="' + val.param + '"]').addClass('error');
        //             $('label.' + val.param + '-msg').html(cnMessagesShow([val.msg], 'e'));
        //         });
        //     }
        //
        //     if (result.status) {
        //         window.location = result.url;
        //     } else {
        //         $('#msg-com-error').text(result.msg);
        //     }
        // }
           console.log(result);
    });
});

$("body").on('click', '#profile-img', function () {
    $("#status-options").toggleClass("active");
});

$("body").on('click', '.expand-button', function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

$("body").on('click', '#status-options ul li', function () {
    // $("#profile-img").removeClass();
    // $("#status-online").removeClass("active");
    // $("#status-away").removeClass("active");
    // $("#status-busy").removeClass("active");
    // $("#status-offline").removeClass("active");
    // $(this).addClass("active");
    //
    // if ($("#status-online").hasClass("active")) {
    //     $("#profile-img").addClass("online");
    // } else if ($("#status-away").hasClass("active")) {
    //     $("#profile-img").addClass("away");
    // } else if ($("#status-busy").hasClass("active")) {
    //     $("#profile-img").addClass("busy");
    // } else if ($("#status-offline").hasClass("active")) {
    //     $("#profile-img").addClass("offline");
    // } else {
    //     $("#profile-img").removeClass();
    // }
    //
    // $("#status-options").removeClass("active");
});