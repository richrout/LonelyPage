/// <reference path="typings/jquery/jquery.d.ts" />
var lonely = (function () {
    function lonely() {
    }
    lonely.init = function () {
        lonely.registerLinks();

        // On back (or forward) browser buttons, navigate
        window.onpopstate = function (event) {
            if (event.state) {
                lonely.loadContent(event.state.href);
            }
        };
    };

    lonely.pushState = function (statedata, title, url) {
        if (window.history && window.history.pushState) {
            window.history.pushState(statedata, title, url);
        } else {
            // #todo implement our own stack with state data
            window.location.hash = url;
        }
    };

    lonely.loadContent = function (url, method) {
        $.ajax({
            url: url,
            type: method || lonely.defaultMethod,
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
                    lonely.pushState({ href: url }, url, url);
                } else {
                    throw new Error("Selector " + lonely.contentSelector + " not found in DOM. Please set your content your selector using lonely.contentSelector");
                }
            }

            // re-register links
            lonely.registerLinks();
        });
    };

    lonely.registerLinks = function () {
        $("a").off('click').click(function (e) {
            var target = $(e.currentTarget);
            var url = target.attr('href');
            var method = target.data('method');

            if (target.data('lonely-ignore')) {
                return true;
            }

            lonely.loadContent(url, method);
            return false;
        });
    };
    lonely.contentSelector = '#lonelyContent';
    lonely.layout = null;
    lonely.defaultMethod = "get";
    lonely.responseCallback = null;
    return lonely;
})();

$(function () {
    lonely.init();
});
