LonelyPage
==========
LonelyPage is a one-page solution for ASP.NET MVC that enables you to write your Controllers and Views as your normally would with any regular MVC application.
Just add a little configuration, and you've got yourself an easy one-page application with no fuss!

The Basics
==========
In `Global.asax.cs` place the following line in `Application_Start`

```
LonelyPageConfig.Register();
```

Include lonelypage.js on your page, and set up the configuration using these options:

```
lonely.layout = '~/Views/Shared/_MyPartialLayout.cshtml'; // optional
lonley.containerSelector = '#container'; // sets container which gets populated with the response
lonely.responseCallback = function() {}; // called before lonelypage does any processing. return false to cancel lonelypage actions
```

Task List
=========
- Design Javascript API
- Implement Javascript API
- Decide on conigurable options
- Make initial release
