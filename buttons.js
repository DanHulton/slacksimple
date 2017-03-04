"use strict";

const _ = require('lodash');

/**
 * A collection of buttons to display in Slack.
 */
class Buttons {
	constructor() {
		this.collection = [];
	}

	/**
	 * Add a button to the collection.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param object params  Optional paramters to pass to the command.
	 * @param string style   Optional style for the button.
	 * @param string confirm Optional confirmation instructions.
	 */
	add(text, command, { params={}, style=false, confirm=false } = {})
	{
		this.collection.push(Buttons.single(text, command, { params, style, confirm }));
	}

	/**
	 * Get the count of buttons added so far.
	 *
	 * @return integer
	 */
	get length()
	{
		return this.collection.length;
	}

	/**
	 * Create and return a single button.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param object params  Optional paramters to pass to the command.
	 * @param string style   Optional style for the button.
	 * @param string confirm Optional confirmation instructions.
	 *
	 * @return object
	 */
	static single(text, command, { params={}, style=false, confirm=false } = {})
	{
		let button = {
			name: _.snakeCase(text),
			text: text,
			value: `${command}|${JSON.stringify(params)}`,
			type: "button",
		};

		if (style) {
			button.style = style;
		}

		if (confirm) {
			button.confirm = confirm;
		}

		return button;
	}

	/**
	 * Create and return an Attachments collection with one attachment in it.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param object params  Optional paramters to pass to the command.
	 * @param string style   Optional style for the button.
	 * @param string confirm Optional confirmation instructions.
	 *
	 * @return object
	 */
	static one(text, command, { params={}, style=false, confirm=false } = {})
	{
		let buttons = new Buttons();

		buttons.add(text, command, { params, style, confirm });

		return buttons;
	}

	/**
	 * Get the collection of buttons.
	 *
	 * @return array
	 */
	getCollection()
	{
		return this.collection;
	}
}

module.exports = Buttons;