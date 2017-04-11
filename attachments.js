"use strict";

const _ = require('lodash');
const Actions = require('./actions');

/**
 * A collection of attachments to display in Slack.
 */
class Attachments {
	constructor() {
		this.collection = [];
	}

	/**
	 * Add an attachment to the collection.
	 *
	 * @param string  title       A bold title to place at the top of your attachment.
	 * @param string  pretext     Text to place before your attachment.
	 * @param string  text        The text to place inside your attachment.
	 * @param string  fallback    Fallback text to display on devices that can't display complex attachments.
	 * @param string  color       A colour value to display to the left of your attachment.
	 * @param Fields  fields      A collection of fields to add to your attachment.
	 * @param Actions actions     A collection of actions to add to your attachment.
	 * @param string  callback_id Identifies the collection of actions.  REQUIRED if actions set!
	 * @param string  image_url   URL for an image.
	 * @param string  thumb_url   URL for a thumbnail image.
	 *
	 * @return Attachments
	 */
	add({
		title = false,
		pretext = false,
		text = false,
		fallback = false,
		color = false,
		fields = false,
		actions = false,
		callback_id = false,
		image_url = false,
		thumb_url = false,
	} = {}) {
		this.collection.push(Attachments.single({
			title,
			pretext,
			text,
			fallback,
			color,
			fields,
			actions,
			callback_id,
			image_url,
			thumb_url
		}));

		return this;
	}

	/**
	 * Get the count of attachments added so far.
	 *
	 * @return integer
	 */
	get length()
	{
		return this.collection.length;
	}

	/**
	 * Create and return a single attachment.
	 *
	 * @param string  title       A bold title to place at the top of your attachment.
	 * @param string  pretext     Text to place before your attachment.
	 * @param string  text        The text to place inside your attachment.
	 * @param string  fallback    Fallback text to display on devices that can't display complex attachments.
	 * @param string  color       A colour value to display to the left of your attachment.
	 * @param Fields  fields      A collection of fields to add to your attachment.
	 * @param Actions actions     A collection of actions to add to your attachment.
	 * @param string  callback_id Identifies the collection of actions.  REQUIRED if actions set!
	 * @param string  image_url   URL for an image.
	 * @param string  thumb_url   URL for a thumbnail image.
	 *
	 * @return object
	 */
	static single({
		title = false,
		pretext = false,
		text = false,
		fallback = false,
		color = false,
		fields = false,
		actions = false,
		callback_id = false,
		image_url = false,
		thumb_url = false,
	} = {}) {
		let attachment = {};

		if (title) {
			attachment.title = title;
		}

		if (pretext) {
			attachment.pretext = pretext;
		}

		if (text) {
			attachment.text = text;
		}

		if (fallback) {
			attachment.fallback = fallback;
		}

		if (color) {
			attachment.color = color;
		}

		if (fields) {
			if (Array.isArray(fields)) {
				attachment.fields = fields;
			} else {
				attachment.fields = fields.getCollection();
			}
		}

		if (actions) {
			attachment.actions         = actions.getCollection();
			attachment.attachment_type = 'default';
		}

		if (callback_id) {
			attachment.callback_id = callback_id;
		}

		if (image_url) {
			attachment.image_url = image_url;
		}

		if (thumb_url) {
			attachment.thumb_url = thumb_url;
		}

		return attachment;
	}

	/**
	 * Create and return an Attachments collection with one attachment in it.
	 *
	 * @param string  title       A bold title to place at the top of your attachment.
	 * @param string  pretext     Text to place before your attachment.
	 * @param string  text        The text to place inside your attachment.
	 * @param string  fallback    Fallback text to display on devices that can't display complex attachments.
	 * @param string  color       A colour value to display to the left of your attachment.
	 * @param Fields  fields      A collection of fields to add to your attachment.
	 * @param Actions actions     A collection of actions to add to your attachment.
	 * @param string  callback_id Identifies the collection of actions.  REQUIRED if actions set!
	 * @param string  image_url   URL for an image.
	 * @param string  thumb_url   URL for a thumbnail image.
	 *
	 * @return Attachments
	 */
	static one({
		title = false,
		pretext = false,
		text = false,
		fallback = false,
		color = false,
		fields = false,
		actions = false,
		callback_id = false,
		image_url = false,
		thumb_url = false,
	} = {}) {
		let attachments = new Attachments();

		attachments.add({
			title,
			pretext,
			text,
			fallback,
			color,
			fields,
			actions,
			callback_id,
			image_url,
			thumb_url
		});

		return attachments;
	}

	/**
	 * Add a button to last attachment in collection.  If attachment is full, create a new one.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param object params  Optional paramters to pass to the command.
	 * @param string style   Optional style for the button.
	 * @param string confirm Optional confirmation instructions.
	 *
	 * @return Attachments
	 */
	addButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		let lastAttachment = this.getLastFreeAttachment();

		lastAttachment.actions.push(Actions.singleButton(text, command, { params, style, confirm }));

		return this;
	}

	/**
	 * Add a select to last attachment in collection.  If attachment is full, create a new one.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param array  options The options for the select.
	 *                       [{ text: "Text", params: {} }]
	 *
	 * @return Attachments
	 */
	addSelect(text, command, options=[])
	{
		let lastAttachment = this.getLastFreeAttachment();

		lastAttachment.actions.push(Actions.singleSelect(text, command, options));

		return this;
	}

	/**
	 * Gets the last attachment with room free to add another action.
	 *
	 * @return object
	 */
	getLastFreeAttachment()
	{
		if (this.length == 0) {
			throw new Error("Cannot get attachments from an empty collection.");
		}

		let lastAttachment = this.collection[this.length - 1];

		// Ensure there's an "actions" array to add button to
		if (_.isUndefined(lastAttachment.actions)) {
			lastAttachment.actions = [];
			lastAttachment.attachment_type = 'default';
		}
		// Ensure the attachment we're adding to has room
		else if (lastAttachment.actions.length === 5) {
			const title       = " ";
			const color       = _.get(lastAttachment, "color", false);
			const callback_id = _.get(lastAttachment, "callback_id", false);
			const actions     = new Actions();

			this.add({ title, color, callback_id, actions });

			return this.getLastFreeAttachment();
		}

		return lastAttachment;
	}

	/**
	 * Get the collection of attachments.
	 *
	 * @return array
	 */
	getCollection()
	{
		return this.collection;
	}
}

module.exports = Attachments;