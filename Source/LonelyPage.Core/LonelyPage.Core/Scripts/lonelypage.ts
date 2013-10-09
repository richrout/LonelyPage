/// <reference path="typings/jquery/jquery.d.ts" />

class lonely {
    static contentSelector: string = '#lonelyContent';
    static layout: string = null;
    static defaultMethod: string = "get";
    static responseCallback: Function = null;

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
        if (window.history && window.history.pushState) {
            window.history.pushState(statedata, title, url);
        }
        else {
            // #todo implement our own stack with state data
            window.location.hash = url;
        }
    }

    static loadContent(url: string, method?: string, routeData?: any ) {
        $.ajax({
            url: url,
            type: method || lonely.defaultMethod,
            data: routeData,
            cache: false,
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
                        $(lonely.contentSelector).html(response);
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
    }
}

$(function () {
    lonely.init();
});
