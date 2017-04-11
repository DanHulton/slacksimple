"use strict";

const _ = require('lodash');

/**
 * A collection of buttons/selects to display in Slack.
 */
class Actions {
	constructor() {
		this.collection = [];
	}

	/**
	 * Get the count of actions added so far.
	 *
	 * @return integer
	 */
	get length()
	{
		return this.collection.length;
	}

	/**
	 * Add a button to the collection.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param object params  Optional paramters to pass to the command.
	 * @param string style   Optional style for the button.
	 * @param string confirm Optional confirmation instructions.
	 *
	 * @return Actions
	 */
	addButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		this.collection.push(Actions.singleButton(text, command, { params, style, confirm }));

		return this;
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
	static singleButton(text, command, { params={}, style=false, confirm=false } = {})
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
	 * Create and return an Actions collection with one button in it.
	 *
	 * @param string text    The text to display.
	 * @param string command The name of the command to execute.
	 * @param object params  Optional paramters to pass to the command.
	 * @param string style   Optional style for the button.
	 * @param string confirm Optional confirmation instructions.
	 *
	 * @return object
	 */
	static oneButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		let actions = new Actions();

		actions.addButton(text, command, { params, style, confirm });

		return actions;
	}

	/**
	 * Get the collection of actions.
	 *
	 * @return array
	 */
	getCollection()
	{
		return this.collection;
	}
}

module.exports = Actions;