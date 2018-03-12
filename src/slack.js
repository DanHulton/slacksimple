"use strict";

const WebClient = require('@slack/client').WebClient;

class Slacksimple
{
	/**
	 * Initialize bot.
	 *
	 * @param {string} botToken - The token identifying the connecting bot.
	 * @param {string} appToken - The token identifying the app admin.
	 * @param {string} botId - The ID of the bot that interacts with this Slack workspace.
	 * @param {string} loggerName - The name of the logger we'll output with.
	 */
	constructor(botToken, appToken, botId, loggerName = 'slack')
	{
		this.botToken = botToken;
		this.appToken = appToken;
		this.botId    = botId;
		this.log      = require('bunyan').createLogger({ name: loggerName });
	}

	/**
	 * Connect to Slack and get things started.
	 */
	async connect()
	{
		this.botWebClient = new WebClient(this.botToken);
		this.appWebClient = new WebClient(this.appToken);
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
	 * Delete a message that already exists in Slack.
	 *
	 * @param {string} ts - The timestamp of the message to delete.
	 * @param {string} channel The channel to delete.
	 *
	 * @return {object}
	 */
	async deleteMessage(ts, channel)
	{
		return await this.botWebClient.chat.delete(ts, channel);
	}

	/**
	 * Update a message that already exists in Slack.
	 *
	 * @param {string} ts - The timestamp of the message to update.
	 * @param {string} channel The channel to update.
	 * @param {string} text - The message to write.
	 * @param {object} options - The message options.
	 *
	 * @return {object}
	 */
	async updateMessage(ts, channel, text, options)
	{
		return await this.botWebClient.chat.update(ts, channel, text, options);
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

	/**
	 * Get the UIDs of the members connected to a channel.
	 *
	 * @param {string} channel - The ID of the channel.
	 *
	 * @return {array}
	 */
	async getConversationMembers(channel)
	{
		const response = await this.botWebClient.conversations.members(channel);
		return response.members;
	}

	/**
	 * Get information about a conversation.
	 *
	 * @param {string} channel - The ID of the channel.
	 *
	 * @return {object}
	 */
	async getConversationInfo(channel)
	{
		const response = await this.botWebClient.conversations.info(channel);
		return response.channel;
	}
}

module.exports = Slacksimple;