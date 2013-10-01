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

Submitting a form will automatically serialize the data in the form and use the form's method to send that data to the server

Task List
=========
- Design Javascript API
- Set up data-lonely-model stuff
- Make form submit serialize data
- Allow for special cases on certain links
- Implement Javascript API
- Decide on conigurable options
- Make initial release
