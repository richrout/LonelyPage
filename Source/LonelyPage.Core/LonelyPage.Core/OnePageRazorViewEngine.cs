using System;
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

            return view;
        }
    }
}
