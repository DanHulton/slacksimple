"use strict";

/**
 * A collection of options to display in menu item message actions.
 */
class Options {
	constructor() {
		this.collection = [];
	}

	/**
	 * Add an option to the collection.
	 *
	 * @param string  text   The text of the option.
	 * @param object  params The parameters for the otpion.
	 */
	add(text, params)
	{
		this.collection.push({ text, params });
	}

	/**
	 * Get the count of options added so far.
	 *
	 * @return integer
	 */
	get length()
	{
		return this.collection.length;
	}

	/**
	 * Get the collection of options.
	 *
	 * @return array
	 */
	getCollection()
	{
		return this.collection;
	}
}

module.exports = Options;