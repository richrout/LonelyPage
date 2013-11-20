using System;
using System.Web;
using System.Web.Mvc;

namespace LonelyPage.Core
{
    public class OnePageRazorViewEngine : RazorViewEngine
    {
        protected override IView CreateView(ControllerContext controllerContext, string viewPath, string masterPath)
        {
            var hasHeader = Convert.ToBoolean(controllerContext.HttpContext.Request.Headers.Get("X-LonelyPartialRequest"));
            var layout = Convert.ToString(controllerContext.HttpContext.Request.Headers.Get("X-LonelyLayout"));
            
            RazorView view;
            if (hasHeader)
            {
                view = (RazorView)base.CreateView(controllerContext, viewPath, layout ?? "~/Views/Shared/_LonelyLayout.cshtml");
            }
            else
            {
                view = (RazorView)base.CreateView(controllerContext, viewPath, masterPath);
            }

            var request = controllerContext.HttpContext.Request;
            if (request.Url != null)
            {
                var appUrl = VirtualPathUtility.ToAbsolute("~/");
                var url = HttpContext.Current.Request.Url.PathAndQuery.Remove(0, appUrl.Length - 1);
                controllerContext.HttpContext.Response.Headers.Set("X-LonelyFinalUrl", url);
            }
            return view;
        }
    }
}
