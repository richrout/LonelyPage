using System;
using System.Reflection;
using Castle.DynamicProxy;

namespace LonelyPage.Core
{
    public class ControllerProxyGenerationHook : IProxyGenerationHook
    {
        public void NonProxyableMemberNotification(Type type, MemberInfo memberInfo)
        {
        }

        public bool ShouldInterceptMethod(Type type, MethodInfo memberInfo)
        {
            return memberInfo.Name.Contains("View");
        }

        public void MethodsInspected()
        {
        }
    }
}
