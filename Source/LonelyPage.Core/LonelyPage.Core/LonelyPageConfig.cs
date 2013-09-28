using System.Web.Mvc;

namespace LonelyPage.Core
{
    public static class LonelyPageConfig
    {
        public static void Register()
        {
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new OnePageRazorViewEngine());
            ViewEngines.Engines.Add(new OnePageWebFormsViewEngine());
        }
    }
}
