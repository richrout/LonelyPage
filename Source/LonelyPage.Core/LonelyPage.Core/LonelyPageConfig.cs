using System.Web.Mvc;

namespace LonelyPage.Core
{
    public static class LonelyPageConfig
    {
        public static void Register()
        {
            IControllerFactory factory = new OnePageControllerFactory();
            ControllerBuilder.Current.SetControllerFactory(factory);
        }
    }
}
