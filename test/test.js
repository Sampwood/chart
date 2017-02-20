'use strict';

var expect = require('chai').expect;
var add = require('../js/demo')

describe('#test', function() {
	it('should be right', function() {
		var result = add(1, 1);
		expect(result).to.equal(2);
	})
});