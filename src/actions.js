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
	 * @return {integer}
	 */
	get length()
	{
		return this.collection.length;
	}

	/**
	 * Add a button to the collection.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {object} params - Optional paramters to pass to the command.
	 * @param {string} style - Optional style for the button.
	 * @param {string} confirm - Optional confirmation instructions.
	 *
	 * @return {Actions}
	 */
	addButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		this.collection.push(Actions.singleButton(text, command, { params, style, confirm }));

		return this;
	}

	/**
	 * Remove a row's worth of buttons.
	 */
	dropRow()
	{
		this.collection = _.drop(this.collection, 5);
	}

	/**
	 * Create and return a single button.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {object} params - Optional paramters to pass to the command.
	 * @param {string} style - Optional style for the button.
	 * @param {string} confirm - Optional confirmation instructions.
	 *
	 * @return {object}
	 */
	static singleButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		let button = {
			name: _.snakeCase(text),
			text,
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
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {object} params - Optional paramters to pass to the command.
	 * @param {string} style - Optional style for the button.
	 * @param {string} confirm - Optional confirmation instructions.
	 *
	 * @return {object}
	 */
	static oneButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		let actions = new Actions();

		actions.addButton(text, command, { params, style, confirm });

		return actions;
	}

	/**
	 * Add a select to the collection.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {array} options - The options for the select.
	 *                       [{ text: "Text", params: {} }]
	 *
	 * @return {Actions}
	 */
	addSelect(text, command, options=[])
	{
		this.collection.push(Actions.singleSelect(text, command, options));

		return this;
	}

	/**
	 * Create and return a single select.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {array} options - The options for the select.
	 *                       [{ text: "Text", params: {} }]
	 *
	 * @return {object}
	 */
	static singleSelect(text, command, options=[])
	{
		return {
			name: _.snakeCase(text),
			text,
			type: "select",
			options: options.map((option) => {
				return {
					text: option.text,
					value: `${command}|${JSON.stringify(_.get(option, 'params', {}))}`,
				};
			})
		};
	}

	/**
	 * Create and return an Actions collection with one button in it.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {array} options - The options for the select.
	 *                       [{ text: "Text", params: {} }]
	 *
	 * @return {object}
	 */
	static oneSelect(text, command, options=[])
	{
		let actions = new Actions();

		actions.addSelect(text, command, options);

		return actions;
	}

	/**
	 * Get the collection of actions.
	 *
	 * @return {array}
	 */
	getCollection()
	{
		return this.collection;
	}
}

module.exports = Actions;