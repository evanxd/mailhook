# mailhook
A Node.js library to setup hooks to trigger Webhooks then receive emails.

## How-to
Initialize a Mailhook instance.
```js
var Mailhook = require('mqtthook');
var mailhook = new Mailhook('user', 'password', 'host');
```

Trigger a Webhook to do something when receive an email.
```js
mailhook.hook()
        .if(data => { return data.fromEmail === "white-list-mail@your-host.com"; })
        .trigger('https://webhook.fake/hooks/3345678');
```
