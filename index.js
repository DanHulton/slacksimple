const Slack       = require('./src/slack');
const Actions     = require('./src/actions');
const Options     = require('./src/options');
const Fields      = require('./src/fields');
const Attachments = require('./src/attachments');
const Dialog      = require('./src/dialog');

module.exports = {
	Slack,
	Actions,
	Options,
	Fields,
	Attachments,
	Dialog,

	TEXT_SUBTYPE_EMAIL: 'email',
	TEXT_SUBTYPE_NUMBER: 'number',
	TEXT_SUBTYPE_TELEPHONE: 'tel',
	TEXT_SUBTYPE_URL: 'url',
};