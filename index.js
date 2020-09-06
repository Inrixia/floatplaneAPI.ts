const Auth = require('./auth')
const User = require('./user')
const Api = require('./api')
const Creator = require('./creator')
const Video = require('./video')

const Core = require('./core.js')

module.exports = class Floatplane extends Core {
	constructor() {
		super(require('got').extend({ // Sets the global requestMethod to be used, this maintains headers
			headers: {
				'User-Agent': `FloatplaneAPI/${require('./package.json').version} (Inrix, +https://github.com/Inrixia/floatplaneAPI.js)`,
				'accept': 'application/json'
			},
			jar: true, // Use the same cookies globally
			followAllRedirects: true,
			mutableDefaults: true
		}))
		this.auth = new Auth(this.got)
		this.user = new User(this.got)
		this.api = new Api(this.got)
		this.creator = new Creator(this.got)
		this.video = new Video(this.got)
	}

	/**
	 * Login to floatplane so future requests are authenticated
	 * @param {object} options Login options
	 * @param {string} options.username Username to login with
	 * @param {string} options.password Password to login with
	 * @param {string} options.token 2 Factor token to login with
	 * @returns {Promise<{ 
		needs2FA: boolean,
		user: {
			id: string,
			username: string,
			profileImage: {
				width: number,
				height: number,
				path: string,
				childImages: Array<{ width: number, height: number, path: string }>
			}
		}
	}>} User object OR `{ needs2FA: true }` if user requires 2 Factor authentication.
	*/
	login = async options => {
		if (typeof options.username !== 'string') throw new Error('Username must be a string!')
		if (typeof options.password !== 'string') throw new Error('Password must be a string!')
		
		let result = await this.auth.login(options.username, options.password)

		if (result.needs2FA) {
			if (typeof options.token !== 'string') throw new Error('Token must be a string!')
			result = await this.auth.factor(options.token)
		}

		return result
	}
}