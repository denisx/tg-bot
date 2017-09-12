const NAME = 'start.js'
const DEV = global.DEV || false
const errLog = global.errLog

class Menu {
	constructor(opts) {
		DEV && console.log(NAME, 'menu() constructor', Object.keys(opts))

		this.init(opts)
	}

	async init({ id, app }) {
		DEV && console.log(NAME, 'start init()')
		const session = app.sessions[id]
		const textFrame = app.texts.getFrameTextBySession(session)
		const tf = [...textFrame]

		DEV && console.log(NAME, 'init(), try app.send()')
		const sendRes = await app.send(id, {
			type: 'sendMessage',
			data: tf
		})
			.catch(err => errLog(NAME, 'init(), app.send', err))

		DEV && console.log(NAME, 'end init()')
		return sendRes
		// return Promise.resolve()
	}
}

module.exports = async(opts) => {
	return new Menu(opts)
}
