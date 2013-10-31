/// <reference path="typings/typings.d.ts" />
/// <reference path="typings/jquery.validation/jquery.validation.d.ts" />
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

    lonely.loadContent = function (url, method, routeData, done, fail, always) {
        var request = $.ajax({
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
        });

        if (done && $.isFunction(done)) {
            request.done(done);
        } else {
            request.done(function (response, status, xhr) {
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

                                // re-register links
                                lonely.registerLinks();
                            });
                        } else if (lonely.transition == 'slide') {
                            $(lonely.contentSelector).slideUp(lonely.transitionSpeed, function () {
                                $(this).html(response).slideDown(lonely.transitionSpeed);

                                // re-register links
                                lonely.registerLinks();
                            });
                        } else {
                            $(lonely.contentSelector).html(response);

                            // re-register links
                            lonely.registerLinks();
                        }
                        lonely.pushState({ url: url, method: method, routeData: routeData }, url, url);
                    } else {
                        throw new Error("Selector " + lonely.contentSelector + " not found in DOM. Please set your content your selector using lonely.contentSelector");
                    }
                }
            });
        }

        if (fail && $.isFunction(fail)) {
            request.fail(fail);
        }

        if (always && $.isFunction(always)) {
            request.always(always);
        }
    };

    lonely.registerLinks = function () {
        $("a").off('click').click(function (e) {
            var target = $(e.currentTarget);
            var url = target.attr('href');
            var method = target.data('method');
            var data = target.data('data');

            var done = target.data('lonely-done');
            if (done) {
                done = eval('window.' + done);
            }

            var fail = target.data('lonely-fail');
            if (fail) {
                fail = eval('window.' + fail);
            }

            var always = target.data('lonely-always');
            if (always) {
                always = eval('window.' + always);
            }

            if (target.data('lonely-ignore')) {
                return true;
            }

            lonely.loadContent(url, method, data, done, fail, always);

            return false;
        });

        $("form").off('submit').submit(function (e) {
            var target = $(e.currentTarget);
            var url = target.attr('action');
            var method = target.attr('method');

            var done = target.data('lonely-done');
            if (done) {
                done = eval('window.' + done);
            }

            var fail = target.data('lonely-fail');
            if (fail) {
                fail = eval('window.' + fail);
            }

            var always = target.data('lonely-always');
            if (always) {
                always = eval('window.' + always);
            }

            if (target.data('lonely-ignore')) {
                return true;
            }

            var ajaxData = target.serializeObject();

            var formIsValid = target.valid ? target.valid() : true;

            if (formIsValid) {
                lonely.loadContent(url, method, ajaxData, done, fail, always);
            }

            return false;
        });

        if ($.validator && $.validator.unobtrusive) {
            // Rebind forms with unobtrusive validation
            $.validator.unobtrusive.parse('form');
        }
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

(function ($) {
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        for (var i = 0; i < a.length; i++) {
            var _this = a[i];
            if (o[_this.name] !== undefined) {
                if (!o[_this.name].push) {
                    o[_this.name] = [o[_this.name]];
                }
                o[_this.name].push(_this.value || '');
            } else {
                o[_this.name] = _this.value || '';
            }
        }
        return o;
    };
})(jQuery);
