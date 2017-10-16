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
	 * @param {string} botToken - The token identifying the connecting bot.
	 * @param {string} appToken - The token identifying the app admin.
	 * @param {string} loggerName - The name of the logger we'll output with.
	 */
	constructor(botToken, appToken, loggerName = 'slack')
	{
		this.botToken = botToken;
		this.appToken = appToken;
		this.log      = require('bunyan').createLogger({ name: loggerName });
	}

	/**
	 * Connect to Slack and get things started.
	 */
	async connect()
	{
		this._connectWebClient(this.botToken, this.appToken);
		await this._connectRtmClient(this.botToken);
	}

	/**
	 * Connect the real-time slack client.
	 *
	 * @param {string} botToken - The token identifying the connecting bot.
	 *
	 * @return void
	 */
	async _connectRtmClient(botToken)
	{
		this.log.info('Connecting to Slack...');

		this.rtmClient = new RtmClient(botToken, { logLevel: process.env.RTM_LOG_LEVEL });
		this.rtmClient.start();

		await this.rtmClient.on(RTM_CLIENT_EVENTS.AUTHENTICATED);

		this.log.info('Connected to Slack!');
	}

	/**
	 * Connect the web slack client.
	 *
	 * @param {string} botToken - The token identifying the connecting bot.
	 * @param {string} appToken - The token identifying the app admin.
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
	 * @param {string} channel - The channel to post the message to.
	 * @param {string} text - The text of the message.
	 * @param {object} options - The message options.
	 *
	 * @return {object}
	 */
	async postMessage(channel, text, options)
	{
		return await this.botWebClient.chat.postMessage(channel, text, options);
	}

	/**
	 * Update a message that already exists in Slack.
	 *
	 * @param {object} message - The message to update.
	 */
	sendTyping(channel)
	{
		this.rtmClient.sendTyping(channel);
	}

	/**
	 * Update a message that already exists in Slack.
	 *
	 * @param {object} message - The message to update.
	 *
	 * @return {object}
	 */
	async updateMessage(message)
	{
		return await this.rtmClient.updateMessage(message);
	}

	/**
	 * Direct Message a user.
	 *
	 * @param {string} uid - The user ID of the user to message.
	 * @param {string} text - The text of the message to send to them.
	 * @param {object} options - The options of the message to send to them.
	 *
	 * @return {object}
	 */
	async dm(uid, text, options)
	{
		const response = await this.botWebClient.dm.open(uid);
		return await this.postMessage(response.channel.id, text, options);
	}

	/**
	 * Retrieve information about a user.
	 *
	 * @param {string} uid - The user's ID.
	 *
	 * @rturn {object}
	 */
	async userInfo(uid)
	{
		return await this.botWebClient.users.info(uid);
	}

	/**
	 * Create a new public channel.
	 *
	 * @param {string} name - The name of the channel to create.
	 *
	 * @return {object}
	 */
	async createPublicChannel(name)
	{
		return await this.appWebClient.channels.create(name);
	}

	/**
	 * Create a new private channel.
	 *
	 * @param {string} name - The name of the channel to create.
	 *
	 * @return {object}
	 */
	async createPrivateChannel(name)
	{
		return await this.appWebClient.groups.create(name);
	}

	/**
	 * Create a new private channel.
	 *
	 * @param {string} name - The name of the channel to create.
	 *
	 * @return {object}
	 */
	async openPrivateChannel(name)
	{
		return await this.appWebClient.groups.open(name);
	}

	/**
	 * Invite a user to a private channel.
	 *
	* @param {string} channel - The ID of the private channel.
	* @param {string} uid - The ID of the user to invite.
	*
	* @return {object}
	 */
	async invitePrivateChannel(channel, uid)
	{
		return await this.appWebClient.groups.invite(channel, uid);
	}

	/**
	 * Have the admin user leave a private channel.
	 *
 	 * @param {string} channel - The ID of the private channel.
 	 *
 	 * @return {object}
	 */
	async leavePrivateChannel(channel)
	{
		return await this.appWebClient.groups.leave(channel);
	}
}

module.exports = Slacksimple;