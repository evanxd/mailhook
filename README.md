# mailhook
A Node.js library to setup hooks to trigger Webhooks then receive emails.

## How-to
Initialize a Mailhook instance.
```js
var Mailhook = require('mqtthook');
var mailhook = new Mailhook('user', 'password', 'host');
```

Trigger a Webhook to do something when receive emails from a specific email sender.
```js
mailhook.hook("mail@your-host.com")
        .trigger('https://webhook.fake/hooks/3345678');
```
