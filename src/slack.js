"use strict";

const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;

const RTM_EVENTS        = require('@slack/client').RTM_EVENTS;
const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

class Slacksimple
{
	/**
	 * Initialize bot.
	 *
	 * @param string botToken   The token identifying the connecting bot.
	 * @param string appToken   The token identifying the app admin.
	 * @param string loggerName The name of the logger we'll output with.
	 */
	constructor(botToken, appToken, loggerName = 'slack')
	{
		this.botToken = botToken;
		this.appToken = appToken;
		this.log      = require('bunyan').createLogger({ name: loggerName });
	}

	/**
	 * Connect to Slack and get things started.
	 *
	 * @param function onClientPresenceChange A function to bind to this event (optional).
	 * @param function onMessage              A function to bind to this event (optional).
	 * @param object   bot                    The bot handling events (optional).
	 */
	connect({ onClientPresenceChange, onMessage, bot })
	{
		this._connectRtmClient(this.teamName, this.botToken, onClientPresenceChange, onMessage, bot);
		this._connectWebClient(this.botToken, this.appToken);
	}

	/**
	 * Connect the real-time slack client.
	 *
	 * @param string   teamName               The name of the team we're connecting to.
	 * @param string   botToken               The token identifying the connecting bot.
	 * @param function onClientPresenceChange A function to bind to this event (optional).
	 * @param function onMessage              A function to bind to this event (optional).
	 * @param object   bot                    The bot handling events (optional).
	 *
	 * @return void
	 */
	_connectRtmClient(teamName, botToken, onClientPresenceChange, onMessage, bot)
	{
		this.log.info('Connecting to Slack...');

		this.rtmClient = new RtmClient(botToken, { logLevel: process.env.RTM_LOG_LEVEL });
		this.rtmClient.start();

		this.rtmClient.on(RTM_CLIENT_EVENTS.AUTHENTICATED, (rtmStartData) => {
			this.log.info('Connected to Slack.');
		});

		if ( ! _.isUndefined(onClientPresenceChange)) {
			this.rtmClient.on(RTM_EVENTS.PRESENCE_CHANGE, onClientPresenceChange.bind(bot));
		}

		if ( ! _.isUndefined(onMessage)) {
			this.rtmClient.on(RTM_EVENTS.MESSAGE, onMessage.bind(bot));
		}
	}

	/**
	 * Connect the web slack client.
	 *
	 * @param string botToken The token identifying the connecting bot.
	 * @param string appToken The token identifying the app admin.
	 *
	 * @return void
	 */
	_connectWebClient(botToken, appToken)
	{
		this.botWebClient = new WebClient(botToken);
		this.appWebClient = new WebClient(appToken);
	}

	/**
	 * Post a message to a channel.
	 *
	 * @param string   channel The channel to post the message to.
	 * @param string   text    The text of the message.
	 * @param object   options The message options.
	 * @param function done    A callback to call when done.
	 */
	postMessage(channel, text, options, done = null)
	{
		this.botWebClient.chat.postMessage(channel, text, options, done);
	}

	/**
	 * Update a message that already exists in Slack.
	 *
	 * @param object message The message to update.
	 */
	sendTyping(channel)
	{
		this.rtmClient.sendTyping(channel);
	}

	/**
	 * Update a message that already exists in Slack.
	 *
	 * @param object   message The message to update.
	 * @param function done    A function to call when done.
	 */
	updateMessage(message, done = null)
	{
		this.rtmClient.updateMessage(message, done);
	}

	/**
	 * Direct Message a user.
	 *
	 * @param string   uid     The user ID of the user to message.
	 * @param string   text    The text of the message to send to them.
	 * @param object   options The options of the message to send to them.
	 * @param function done    A callback to call when done.
	 */
	dm(uid, text, options, done)
	{
		this.botWebClient.dm.open(uid, (err, response) => {
			this.postMessage(response.channel.id, text, options, done);
		});
	}

	/**
	 * Retrieve information about a user.
	 *
	 * @param string   uid  The user's ID.
	 * @param function done Called with user details from Slack.
	 */
	userInfo(uid, done)
	{
		this.botWebClient.users.info(uid, done);
	}

	/**
	 * Create a new public channel.
	 *
	 * @param string   name The name of the channel to create.
	 * @param function done A function to call when complete.
	 */
	createPublicChannel(name, done)
	{
		this.appWebClient.channels.create(name, done);
	}

	/**
	 * Create a new private channel.
	 *
	 * @param string   name The name of the channel to create.
	 * @param function done A function to call when complete.
	 */
	createPrivateChannel(name, done)
	{
		this.appWebClient.groups.create(name, done);
	}

	/**
	 * Create a new private channel.
	 *
	 * @param string   name The name of the channel to create.
	 * @param function done A function to call when complete.
	 */
	openPrivateChannel(name, done)
	{
		this.appWebClient.groups.open(name, done);
	}

	/**
	 * Invite a user to a private channel.
	 *
	* @param string   channel The ID of the private channel.
	* @param string   uid     The ID of the user to invite.
	* @param function done    A function to call when complete.
	 */
	invitePrivateChannel(channel, uid, done)
	{
		this.appWebClient.groups.invite(channel, uid, done);
	}

	/**
	 * Have the admin user leave a private channel.
	 *
 	 * @param string   channel The ID of the private channel.
	 * @param function done    A function to call when complete.
	 */
	leavePrivateChannel(channel, done)
	{
		this.appWebClient.groups.leave(channel, done);
	}
}

module.exports = Slacksimple;