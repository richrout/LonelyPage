/// <reference path="typings/jquery/jquery.d.ts" />
var lonely = (function () {
    function lonely() {
    }
    lonely.init = function () {
        lonely.registerLinks();

        // On back (or forward) browser buttons, navigate
        window.onpopstate = function (event) {
            if (event.state) {
                lonely.loadContent(event.state.url, event.state.method, event.state.routeData);
            }
        };
    };

    lonely.pushState = function (statedata, title, url) {
        if (window.location.pathname != url) {
            if (window.history && window.history.pushState) {
                window.history.pushState(statedata, title, url);
            } else {
                // #todo implement our own pushState stack for hash fallback
                window.location.hash = url;
            }
        }
    };

    lonely.loadContent = function (url, method, routeData) {
        $.ajax({
            url: url,
            type: method || lonely.defaultMethod,
            data: routeData,
            cache: lonely.cache,
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
                    if (lonely.transition == 'fade') {
                        $(lonely.contentSelector).fadeOut(lonely.transitionSpeed, function () {
                            $(this).html(response).fadeIn(lonely.transitionSpeed);
                        });
                    } else if (lonely.transition == 'slide') {
                        $(lonely.contentSelector).slideUp(lonely.transitionSpeed, function () {
                            $(this).html(response).slideDown(lonely.transitionSpeed);
                        });
                    } else {
                        $(lonely.contentSelector).html.html(response);
                    }
                    lonely.pushState({ url: url, method: method, routeData: routeData }, url, url);
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
        $("form").off('submit').submit(function (e) {
            alert('form submit not implemented');
            console.log(e);
        });
    };
    lonely.contentSelector = '#lonelyContent';
    lonely.layout = null;
    lonely.defaultMethod = "get";
    lonely.cache = false;
    lonely.responseCallback = null;
    lonely.transition = null;
    lonely.transitionSpeed = 'fast';
    return lonely;
})();
$(function () {
    lonely.init();
});
