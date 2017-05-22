/*eslint mocha:true */
"use strict";

const Actions = require(`../src/actions`);

// -- Tests ----------------------------------------------------------------------------------------

describe('Actions', () => {

	describe('getCollection()', () => {

		it('should start with an empty collection', () => {
			let actions = new Actions();

			expect(actions.getCollection()).toEqual([]);
		});

		it('should create a valid select', () => {
			const select = Actions.singleSelect('text', 'command', [
				{ text: 'option1', params: { param1: 'param1val' } },
				{ text: 'option2' },
			]);

			expect(select).toEqual({
				text: "text",
				type: "select",
				name: "text",
				options: [{
					text: "option1",
					value: "command|{\"param1\":\"param1val\"}"
				}, {
					text: "option2",
					value: "command|{}"
				}],
			});
		});
	});
});