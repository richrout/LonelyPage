/// <reference path="typings/jquery/jquery.d.ts" />

class lonely {
    static contentSelector: string = '#lonelyContent';
    static layout: string = null;
    static defaultMethod: string = "get";
    static cache: boolean = false;
    static responseCallback: Function = null;
    static transition: string = null;
    static transitionSpeed: string = 'fast';

    static init() {
        lonely.registerLinks();

        // On back (or forward) browser buttons, navigate
        window.onpopstate = (event) => {
            if (event.state) {
                lonely.loadContent(event.state.url, event.state.method, event.state.routeData);
            }
        };
    }

    static pushState(statedata: any, title: string, url?: string) {
        if (window.location.pathname != url) {
            if (window.history && window.history.pushState) {
                window.history.pushState(statedata, title, url);
            }
            else {
                // #todo implement our own pushState stack for hash fallback
                window.location.hash = url;
            }
        }
    }

    static loadContent(url: string, method?: string, routeData?: any) {
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
        })
            .done(function (response, status, xhr) {
                var isContinue = true;
                if (lonely.responseCallback) {
                    isContinue = lonely.responseCallback.call(this, response, status, xhr);
                    isContinue = isContinue !== false;
                }

                if (isContinue) {
                    if ($(lonely.contentSelector).length) {
                        if (lonely.transition == 'fade') {
                            $(lonely.contentSelector).fadeOut(lonely.transitionSpeed, function () {
                                $(this).html(response)
                                    .fadeIn(lonely.transitionSpeed);
                            });
                        }
                        else if (lonely.transition == 'slide') {
                            $(lonely.contentSelector).slideUp(lonely.transitionSpeed, function () {
                                $(this).html(response)
                                    .slideDown(lonely.transitionSpeed);
                            });
                        }
                        else {
                            $(lonely.contentSelector).html(response);
                        }
                        lonely.pushState({ url: url, method: method, routeData: routeData }, url, url);
                    }
                    else {
                        throw new Error("Selector " + lonely.contentSelector + " not found in DOM. Please set your content your selector using lonely.contentSelector");
                    }
                }

                // re-register links
                lonely.registerLinks();
            });
    }

    static registerLinks() {
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
    }
}

$(function () {
    lonely.init();
});
