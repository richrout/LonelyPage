using System;
using System.Web.Mvc;
using Castle.DynamicProxy;

namespace LonelyPage.Core
{
    public class OnePageControllerFactory : DefaultControllerFactory
    {
        protected override IController GetControllerInstance(System.Web.Routing.RequestContext requestContext, Type controllerType)
        {
            ProxyGenerator generator = new ProxyGenerator();
            IController person = (IController)generator.CreateClassProxy(controllerType, new ProxyGenerationOptions(new ControllerProxyGenerationHook()), new ControllerInterceptor());
            return person;
        }
    }
}