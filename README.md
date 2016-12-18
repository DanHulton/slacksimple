# Slackwrapper

A wrapper for [node-slack-sdk](https://github.com/slackhq/node-slack-client) to make the common tasks easier.

## Usage

Setup:
```
const SlackWrapper = require('./slackwrapper');
const slack = new SlackWrapper(botToken, appToken);
slack.connect();
```

Sending a message (with typing indicator):
```
slack.sendTyping(channel);
slack.postMessage(channel, text, opts);
```

Monitoring typed messages:
```
slack.connect({ onMessage: this.onMessage, bot: this });
```

Responding to presence events:
```
slack.connect({ onClientPresenceChange: this.onClientPresenceChange, bot: this });
```