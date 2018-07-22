"use strict";

class Dialog {
	constructor(title, callbackId, { submitLabel = 'Submit', notifyOnCancel = false } = {})
	{
		this.title = title;
		this.callbackId = callbackId;
		this.submitLabel = submitLabel;
		this.notifyOnCancel = notifyOnCancel;
		this.elements = [];
	}

	/**
	 * Gets the dialog object for sending to Slack.
	 *
	 * @return {object}
	 */
	getDialog()
	{
		return {
			title: this.title,
			callback_id: this.callbackId,
			submit_label: this.submitLabel,
			notify_on_cancel: this.notifyOnCancel,
			// callback id?  I dunno, I'm tired
			elements: this.elements,
		};
	}

	/**
	 * Add a text element to the elements to display on this dialog.
	 *
	 * Options can be found: https://api.slack.com/dialogs#text_elements
	 *
	 * @param {string} label - The label to use for this element.
	 * @param {string} name - The name of this element.
	 * @param {object} options - Options to further modify the element.
	 */
	addTextElement(label, name, options = {})
	{
		this.elements.push({
			label,
			name,
			type: 'text',
			...options
		});
	}

	/**
	 * Add a text area element to the elements to display on this dialog.
	 *
	 * Options can be found: https://api.slack.com/dialogs#textarea_elements
	 *
	 * @param {string} label - The label to use for this element.
	 * @param {string} name - The name of this element.
	 * @param {object} options - Options to further modify the element.
	 */
	addTextAreaElement(label, name, options = {})
	{
		this.elements.push({
			label,
			name,
			type: 'textarea',
			...options
		});
	}

	/**
	 * Add a select element to the elements to display on this dialog.
	 *
	 * Options can be found: https://api.slack.com/dialogs#select_elements
	 *
	 * @param {string} label - The label to use for this element.
	 * @param {string} name - The name of this element.
	 * @param {[label, value]} data - The data to display in the select element.
	 * @param {object} options - Options to further modify the element.
	 */
	addSelectElement(label, name, data, options = {})
	{
		this.elements.push({
			label,
			name,
			type: 'select',
			options: data,
			...options
		});
	}
}

module.exports = Dialog;