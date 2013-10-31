LonelyPage
==========
LonelyPage is a one-page solution for ASP.NET MVC that enables you to write your Controllers and Views as you normally would with any regular MVC application.
Just add a little configuration, and you've got yourself an easy one-page application with no fuss!

Alpha
=====
LonelyPage is still in very early alpha. We encourage you to give it a try and let us know if anything doesn't work the way you want. Send us pull requests and we'll be happy to take a look!

The Basics
==========
Install LonelyPage using nuget (https://www.nuget.org/packages/LonelyPage)

```
PM> Install-Package LonelyPage
```

In `Global.asax.cs` place the following line in `Application_Start`

```
LonelyPageConfig.Register();
```

Include lonelypage.js on your page

```
<script src="/Scripts/lonelypage.js"></script>
```

Then you can set up the configuration using these options (all optional):

```
lonely.layout = '~/Views/Shared/_MyPartialLayout.cshtml'; // set custom layout
lonley.containerSelector = '#lonelyContainer'; // sets container which gets populated with the response
lonely.responseCallback = function() {}; // called before lonelypage does any processing. return false to cancel lonelypage actions
lonely.transition = 'fade'; // allows 'fade', 'slide' or none
lonely.transitionSpeed = 'fast'; // any jQuery duration is accepted
lonely.cache = false; // cache page responses
```

More Configurations
===================
To make a link ignore LonelyPage and behave like a regular link:
```
<a href="Link/To/Somewhere" data-lonely-ignore="true" />
```

To make a link `post` instead of `get`:
```
<a href="Link/To/Somewhere" data-lonely-method="post" />
```

To make a link send some data to the server:
```
<a href="Link/To/Somewhere" data-lonely-model="{ SomeData: 'Information', ThisIs: 'JSON' }" />
```

Submitting a form will automatically serialize the data in the form and use the form's method to send that data to the server.
However you can specify custom callbacks for the form. These follow the jQuery done, fail and always ajax callbacks. These can also be applied to a `a` tag too.

```
<form action="Link/To/Somewhere" method="POST" data-lonely-done="PostComplete" data-lonely-fail="PostFailed" data-lonely-always="PostAlways" />
```

Task List
=========
- Implement hash/pushstate fallback
- Publish minified JS files
- Make initial release
