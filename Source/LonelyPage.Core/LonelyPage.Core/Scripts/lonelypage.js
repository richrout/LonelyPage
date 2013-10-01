/// <reference path="typings/jquery/jquery.d.ts" />
var lonely = (function () {
    function lonely() {
    }
    lonely.registerLinks = function () {
        $("a").off('click').click(function (e) {
            var target = $(e.currentTarget);
            var url = target.attr('href');
            var method = target.data('method') || "get";

            if (target.data('lonely-ignore')) {
                return true;
            }

            $.ajax({
                url: url,
                type: method,
                cache: false,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("X-LonelyPartialRequest", "true");
                    if (lonely.layout) {
                        xhr.setRequestHeader("X-LonelyLayout", lonely.layout);
                    }
                }
            }).done(function (response, status, xhr) {
                var isContinue = true;
                if (lonely.responseCallback) {
                    isContinue = lonely.responseCallback.call(this, response, status, xhr);
                    isContinue = isContinue !== false;
                }

                if (isContinue) {
                    if ($(lonely.contentSelector).length) {
                        $(lonely.contentSelector).html(response);
                        window.history.pushState(url, url, url);
                    } else {
                        throw new Error("Selector " + lonely.contentSelector + " not found in DOM. Please set your content your selector using lonely.contentSelector");
                    }
                }

                // re-register links
                lonely.registerLinks();
            });

            return false;
        });
    };
    lonely.contentSelector = '#lonelyContent';
    lonely.layout = null;
    lonely.responseCallback = null;
    return lonely;
})();

$(function () {
    lonely.registerLinks();
});
