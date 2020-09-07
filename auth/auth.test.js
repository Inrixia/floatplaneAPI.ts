const { toMatchFormat } = require('@inrixia/helpers/jest')

const auth = new (require('./'))(require('got').extend({ mutableDefaults: true }))
const { username, password } = new (require('@inrixia/db'))('credentials', './credentials.json', false)

const loginFormat = { 
	needs2FA: 'boolean',
	user: {
		id: 'string',
		username: 'string',
		profileImage: {
			width: 'number',
			height: 'number',
			path: 'string',
			childImages: [{
				width: 'number', 
				height: 'number',
				path: 'string'
			}]
		}
	}
}

expect.extend({ toMatchFormat });

test('login', () => expect(auth.login(username, password)).resolves.toMatchFormat(loginFormat));