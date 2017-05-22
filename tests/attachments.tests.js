/*eslint mocha:true */
"use strict";

const Attachments = require(`../src/attachments`);
const Actions     = require(`../src/actions`);

// -- Tests ----------------------------------------------------------------------------------------

describe('Attachments', () => {

	describe('getCollection()', () => {

		it('should start with an empty collection', () => {
			let attachments = new Attachments();

			expect(attachments.getCollection()).toEqual([]);
		});
	});

	describe('addButton()', () => {
		it('should add a button to an attachment it has room', () => {
			let attachments = new Attachments();

			attachments.add({ title: 'title', actions: new Actions() });

			attachments.addButton('text', 'command');

			expect(attachments.getCollection()).toEqual([{
				title: 'title',
				actions: [{
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}],
				attachment_type: 'default'
			}]);
		});

		it('should create a new attachment to add to when there is no room', () => {
			let attachments = new Attachments();

			attachments.add({ title: 'title', callback_id: 'callback_id', color: 'color' });

			attachments.addButton('text', 'command');
			attachments.addButton('text', 'command');
			attachments.addButton('text', 'command');
			attachments.addButton('text', 'command');
			attachments.addButton('text', 'command');
			attachments.addButton('text', 'command');

			expect(attachments.getCollection()).toEqual([{
				title: 'title',
				color: 'color',
				actions: [{
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}, {
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}, {
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}, {
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}, {
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}],
				attachment_type: 'default',
				callback_id: 'callback_id'
			}, {
				title: ' ',
				color: 'color',
				actions: [{
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}],
				attachment_type: 'default',
				callback_id: 'callback_id'
			}]);
		});

		it('should add a button to an attachment without actions', () => {
			let attachments = new Attachments();

			attachments.add({ title: 'title', callback_id: 'callback_id' });

			attachments.addButton('text', 'command');

			expect(attachments.getCollection()).toEqual([{
				title: 'title',
				actions: [{
					name: 'text',
					text: 'text',
					value: 'command|{}',
					type: 'button'
				}],
				callback_id: 'callback_id',
				attachment_type: 'default'
			}]);
		});
	});
});