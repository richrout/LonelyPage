using System;
using System.Web.Mvc;
using Castle.DynamicProxy;

namespace LonelyPage.Core
{
    public class ControllerInterceptor : IInterceptor
    {
        public void Intercept(IInvocation invocation)
        {
            invocation.Proceed();
            var controllerProxy = invocation.Proxy as Controller;
            if (controllerProxy != null)
            {
                var hasHeader = Convert.ToBoolean(controllerProxy.Request.Headers.Get("X-LonelyPartialRequest"));
                var layout = Convert.ToString(controllerProxy.Request.Headers.Get("X-LonelyLayout"));
                if (hasHeader)
                {
                    ViewResult returnValue = invocation.ReturnValue as ViewResult;
                    if (returnValue != null)
                    {
                        returnValue.MasterName = layout ?? "_LonelyLayout";
                    }
                }
            }
        }
    }
}