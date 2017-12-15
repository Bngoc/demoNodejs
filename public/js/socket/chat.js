$('body').on('click', '#status-options .channel-status', function () {
    let dataValue = $(this).attr('data-value');
    let status = $(this).attr('status');

    if (!$('#profile-img').hasClass(status)) {
        if (typeof dataValue !== typeof undefined && dataValue !== false) {
            var dataRequest = {
                url: $('#status-options').attr('data-url'),
                data: {
                    status: dataValue,
                    _method: 'post'
                }
            };

            callDataJS(dataRequest, function (result) {
                if (result) {
                    if (result.status) {
                        $(this).removeClass("active");
                        $(this).addClass("active");
                        $("#profile-img").removeClass().addClass(status);
                    }
                }
            });
        }
        $("#status-options").removeClass("active");
    }
});

$("body").on('click', '#profile-img', function () {
    $("#status-options").toggleClass("active");
});

$("body").on('click', '.expand-button', function () {
    $("#profile").toggleClass("expanded");
    $("#contacts").toggleClass("expanded");
});

$("body").on('click', '#extend-participant', function () {
    if ($(this).hasClass('cursor')) {
        $("#group-participant").toggleClass('display-show');
        $(this).find('i:first-child').toggleClass('fa-minus');
    }
});
