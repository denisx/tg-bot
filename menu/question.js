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

		const userInput = session.userInput
		console.log(123, userInput)

		if (userInput && userInput.text) {
			const accepted = app.menu.checkKeyBoardAcceptedBySession(session)

			if (accepted && accepted.length) {
				console.log('y', accepted)
			} else {
				console.log('n')
			}
		}

		const textFrame = app.texts.getFrameTextBySession(session)
		const tf = [...textFrame]

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
