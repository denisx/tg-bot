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

		if (session.isCallbackQuery) {
			if (session.cbData && session.cbData.st) {
				session.state = session.cbData.st
				session.dropUserText = true
				// await app.services.saveState(id)
				// await app.next(id)
				// app.botInput(id)

				console.log(222)
				const sendRes = await app.runState(id)

				return sendRes
			}
		}

		const textFrame = app.texts.getFrameTextBySession(session)
		const tf = [...textFrame]

		console.log(1, tf)

		const sendRes = await app.send(id, {
			type: 'sendMessage',
			data: tf
		})
			.catch(err => errLog(NAME, 'init(), app.send', err))

		return sendRes
	}
}

module.exports = async(opts) => {
	return new Menu(opts)
}
