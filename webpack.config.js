'use strict';

var path = require('path'),
	webpack = require('webpack');

module.exports = {
	entry: [{
		'lazyload': 'lazyload.js'
	}],
	output: {
		path: path.join(__dirname, '/build'),
		filename: 'lazyload.min.js'
	}
};