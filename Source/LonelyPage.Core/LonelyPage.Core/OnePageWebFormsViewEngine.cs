using System.Web.Mvc;

namespace LonelyPage.Core
{
    public class OnePageWebFormsViewEngine : WebFormViewEngine
    {
        protected override IView CreateView(ControllerContext controllerContext, string viewPath, string masterPath)
        {
            IView view = base.CreateView(controllerContext, viewPath, masterPath);
            return view;
        }
    }
}