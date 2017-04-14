"use strict";

/**
 * A collection of fields to display in Slack.
 */
class Fields {
	constructor() {
		this.collection = [];
	}

	/**
	 * Add a field to the collection.
	 *
	 * @param string  title The title of the field.
	 * @param string  value The value of the field.
	 * @param boolean short Whether the field is short or long.
	 */
	add(title, value, short = false)
	{
		this.collection.push({ title, value, short });
	}

	/**
	 * Get the count of fields added so far.
	 *
	 * @return integer
	 */
	get length()
	{
		return this.collection.length;
	}

	/**
	 * Get the collection of fields.
	 *
	 * @return array
	 */
	getCollection()
	{
		return this.collection;
	}
}

module.exports = Fields;