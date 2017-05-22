/*eslint mocha:true */
"use strict";

const Fields = require(`../src/fields`);

// -- Tests ----------------------------------------------------------------------------------------

describe('Fields', () => {

	describe('getCollection()', () => {
		it('should start with an empty collection', () => {
			let fields = new Fields();

			expect(fields.getCollection()).toEqual([]);
		});
	});

	describe('add()', () => {
		it('should add a field', () => {
			let fields = new Fields();
			fields.add('title', 'value');

			expect(fields.getCollection()).toEqual([
				{ title: 'title', value: 'value', short: false }
			])
		});
	});

	describe('length()', () => {
		it('should properly report collection length', () => {
			let fields = new Fields();
			expect(fields.length).toBe(0);

			fields.add('title', 'value');
			expect(fields.length).toBe(1);
		});
	});
});