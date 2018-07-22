"use strict";

const { drop, snakeCase, get } = require('lodash');

/**
 * A collection of buttons/selects to display in Slack.
 */
class Actions {
	constructor()
	{
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
	 * Get the collection of actions.
	 *
	 * @return {array}
	 */
	getCollection()
	{
		return this.collection;
	}

	/**
	 * Remove a row's worth of buttons.
	 */
	dropRow()
	{
		this.collection = drop(this.collection, 5);
	}

	/**
	 * Adds an action to the collection.
	 *
	 * NOT especially safe, since we just blindly add the object to the collection!  Make sure to
	 * use Action.getButton() or Action.getSelect() to create the action to add.
	 *
	 * @param {object} action - The action to add.
	 *
	 * @return {Actions}
	 */
	addAction(action)
	{
		if (action && ( ! (action instanceof Array) || action.length)) {
			this.collection.push(action);
		}

		return this;
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
		this.collection.push(Actions.getButton(text, command, { params, style, confirm }));

		return this;
	}

	/**
	 * Create and return a button.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {object} params - Optional paramters to pass to the command.
	 * @param {string} style - Optional style for the button.
	 * @param {string} confirm - Optional confirmation instructions.
	 *
	 * @return {object}
	 */
	static getButton(text, command, { params={}, style=false, confirm=false } = {})
	{
		let button = {
			name: snakeCase(text),
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
		this.collection.push(Actions.getSelect(text, command, options));

		return this;
	}

	/**
	 * Create and return a select.
	 *
	 * @param {string} text - The text to display.
	 * @param {string} command - The name of the command to execute.
	 * @param {array} options - The options for the select.
	 *                       [{ text: "Text", params: {} }]
	 *
	 * @return {object}
	 */
	static getSelect(text, command, options=[])
	{
		return {
			name: snakeCase(text),
			text,
			type: "select",
			options: options.map((option) => {
				return {
					text: option.text,
					value: `${command}|${JSON.stringify(get(option, 'params', {}))}`,
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
}

module.exports = Actions;