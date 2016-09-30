"use strict";

const RtmClient = require('@slack/client').RtmClient;
const WebClient = require('@slack/client').WebClient;

const RTM_EVENTS        = require('@slack/client').RTM_EVENTS;
const RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

const Log = require(`${UTIL_PATH}/log`);

class Slack
{
	/**
	 * Initialize bot.
	 *
	 * @param string teamName The name of the team we're connecting to.
	 * @param string botId    The ID of the connecting bot, used to filter out bot messages from logging.
	 * @param string botToken The token identifying the connecting bot.
	 * @param string appToken The token identifying the app admin.
	 */
	constructor(teamName, botId, botToken, appToken)
	{
		this.teamName = teamName;
		this.botId    = botId;
		this.botToken = botToken;
		this.appToken = appToken;

		// If we're not testing, actually send the calls
		this.liveFire = _.isUndefined(process.env.LOADED_MOCHA_OPTS);
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
		if (this.liveFire) {
			this._connectRtmClient(this.teamName, this.botToken, onClientPresenceChange, onMessage, bot);
			this._connectWebClient(this.botToken, this.appToken);
		}
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
		Log.info(`Connecting to '${teamName}'...`);

		this.rtmClient = new RtmClient(botToken, { logLevel: process.env.RTM_LOG_LEVEL });
		this.rtmClient.start();

		this.rtmClient.on(RTM_CLIENT_EVENTS.AUTHENTICATED, (rtmStartData) => {
			this._connected(teamName);
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
	 * Called when connected.
	 *
	 * @param string name The name of the server connected to.
	 *
	 * @return void
	 */
	_connected(name)
	{
		Log.info(`Connected to '${name}'.`);
	}

	/**
	 * Post a message to a channel.
	 *
	 * @param string channel The channel to post the message to.
	 * @param string text    The text of the message.
	 * @param object options The message options.
	 */
	postMessage(channel, text, options)
	{
		if (this.liveFire) {
			this.botWebClient.chat.postMessage(channel, text, options);
		}
	}

	/**
	 * Update a message that already exists in Slack.
	 *
	 * @param object message The message to update.
	 */
	updateMessage(message)
	{
		if (this.liveFire) {
			this.rtmClient.updateMessage(message);
		}
	}

	/**
	 * Direct Message a user.
	 *
	 * @param string uid     The user ID of the user to message.
	 * @param string text    The text of the message to send to them.
	 * @param object options The options of the message to send to them.
	 */
	dm(uid, text, options)
	{
		if (this.liveFire) {
			this.botWebClient.dm.open(uid, (err, response) => {
				this.postMessage(response.channel.id, text, options);
			});
		}
	}

	/**
	 * Retrieve information about a user.
	 *
	 * @param string   uid      The user's ID.
	 * @param function callback Called with user details from Slack.
	 */
	userInfo(uid, callback)
	{
		if (this.liveFire) {
			this.botWebClient.users.info(uid, callback);
		}
	}

	/**
	 * Create a new public channel.
	 *
	 * @param string   name     The name of the channel to create.
	 * @param function callback A function to call when complete.
	 */
	createPublicChannel(name, callback)
	{
		if (this.liveFire) {
			this.appWebClient.channels.create(name, callback);
		}
	}

	/**
	 * Create a new private channel.
	 *
	 * @param string   name     The name of the channel to create.
	 * @param function callback A function to call when complete.
	 */
	createPrivateChannel(name, callback)
	{
		if (this.liveFire) {
			this.appWebClient.groups.create(name, callback);
		}
	}

	/**
	 * Invite a user to a private channel.
	 *
	* @param string   channel  The ID of the private channel.
	* @param string   uid      The ID of the user to invite.
	* @param function callback A function to call when complete.
	 */
	invitePrivateChannel(channel, uid, callback)
	{
		if (this.liveFire) {
			this.appWebClient.groups.invite(channel, uid, callback);
		}
	}

	/**
	 * Have the admin user leave a private channel.
	 *
 	 * @param string   channel  The ID of the private channel.
	 * @param function callback A function to call when complete.
	 */
	leavePrivateChannel(channel, callback)
	{
		if (this.liveFire) {
			this.appWebClient.groups.leave(channel, callback);
		}
	}
}

module.exports = Slack;