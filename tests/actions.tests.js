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
	});

	describe('dropRow()', () => {
		it('should drop a row', () => {
			let actions = new Actions();
			actions.addButton('text-1', 'command-1');
			actions.addButton('text-2', 'command-2');
			actions.addButton('text-3', 'command-3');
			actions.addButton('text-4', 'command-4');
			actions.addButton('text-5', 'command-5');
			actions.addButton('text-6', 'command-6');

			actions.dropRow();

			expect(actions).toEqual({
				collection: [{
					name: "text_6",
					text: "text-6",
					type: "button",
					value: "command-6|{}"
				}]
			});
		});
	});

	describe('addAction()', () => {
		it('should add an action', () => {
			let actions = new Actions();
			let button = Actions.getButton('text', 'command');

			actions.addAction(button);

			expect(actions).toEqual({
				collection: [{
					name: "text",
					text: "text",
					type: "button",
					value: "command|{}"
				}]
			});
		});
	});

	describe('addButton()', () => {
		it('should add a button', () => {
			let actions = new Actions();
			actions.addButton('text', 'command');

			expect(actions).toEqual({
				collection: [{
					name: "text",
					text: "text",
					type: "button",
					value: "command|{}"
				}]
			});
		});
	})

	describe('getButton()', () => {
		it('should create a valid button', () => {
			const button = Actions.getButton('text', 'command', {
				params: { param1: 'val1' },
				style: { stylea: 'vala' },
				confirm: true
			});

			expect(button).toEqual({
				confirm: true,
				name: "text",
				style: { stylea: "vala" },
				text: "text",
				type: "button",
				value: 'command|{"param1":"val1"}'
			});
		});
	});

	describe('oneButton()', () => {
		it('should create an Actions object with one button', () => {
			let actions = Actions.oneButton('text', 'command');

			expect(actions).toEqual({
				collection: [{
					name: "text",
					text: "text",
					type: "button",
					value: "command|{}"
				}]
			});
		});
	});

	describe('addSelect()', () => {
		it('should add a select', () => {
			let actions = new Actions();
			actions.addSelect('text', 'command', [
				{ text: 'option1', params: { param1: 'param1val' } },
				{ text: 'option2' },
			]);

			expect(actions).toEqual({
				collection: [{
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
				}]
			});
		});
	});

	describe('getSelect()', () => {
		it('should create a valid select', () => {
			const select = Actions.getSelect('text', 'command', [
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

	describe('oneSelect()', () => {
		it('should return an Actions object with one select', () => {
			const actions = Actions.oneSelect('text', 'command', [
				{ text: 'option1', params: { param1: 'param1val' } },
				{ text: 'option2' },
			]);

			expect(actions).toEqual({
				collection: [{
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
				}]
			});
		});
	});
});