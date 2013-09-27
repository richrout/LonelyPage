$(function () {

    $("a").off('click').click(function (e) {
        var target = $(e.currentTarget);
        var url = target.attr('href');
        var method = target.data('method') || "get";
        
        $.ajax({
            url: url,
            type: method,
            cache: false,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-LonelyPartialRequest", "true");
            }
        })
            .done(function(response, status, xhr) {
                $("#lonelyContent").html(response);
            });
        return false;
    });

});

