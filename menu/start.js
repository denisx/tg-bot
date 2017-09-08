const NAME = 'start.js'

const errLog = global.errLog

class Menu {
	constructor(opts) {
		console.log(NAME, 'constructor - menu/start', Object.keys(opts))

		this.init(opts)
	}

	async init({ id, app }) {
		console.log(NAME, 'start init()')
		const session = app.sessions[id]
		const textFrame = app.texts.getFrameTextBySession(session)
		const tf = [...textFrame]

		const sendRes = await app.send(id, {
			type: 'sendMessage',
			data: tf
		})
			.catch(err => errLog(NAME, 'init(), app.send', err))

		console.log(NAME, 'end init()')
		return sendRes
		// return Promise.resolve()
	}
}

module.exports = async(opts) => {
	return new Menu(opts)
}
