const { childrenToMatchFormat } = require('@inrixia/helpers/jest')

const creator = new (require('./'))(require('got').extend({ mutableDefaults: true }))
creator.cookie = (new (require('@inrixia/db'))('credentials', './credentials.json', false)).cookie

const videoFormat = {
	id: 'string',
	guid: 'string',
	title: 'string',
	type: 'string',
	description: 'string',
	releaseDate: 'string',
	duration: 'number',
	creator: 'string',
	likes: 'number',
	dislikes: 'number',
	score: 'number',
	isProcessing: 'boolean',
	primaryBlogPost: 'string',
	thumbnail: {
		width: 'number',
		height: 'number',
		path: 'string',
		childImages: [
			{
				width: 'number',
				height: 'number',
				path: 'string'
			}
		]
	},
	isAccessible: 'boolean',
	hasAccess: 'boolean',
	private: 'boolean',
	subscriptionPermissions: [
		'string'
	]
}

expect.extend({ childrenToMatchFormat });

test('subscriptions', () => expect(creator.videos("59f94c0bdd241b70349eb72b")).resolves.childrenToMatchFormat(videoFormat));