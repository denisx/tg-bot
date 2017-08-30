console.log('menu/start')

const texts = global.texts

class Menu {
	constructor(opts) {
		this.app = opts.app
		this.session = opts.session
		return this.init()
	}

	init() {
		const textFrame = texts.getFrameText(this.session.lang, this.session.state)
		const tf = [...textFrame]

		this.app.send(this.session, {
			type: 'sendMessage',
			data: tf
		})

		return Promise.resolve()
	}
}

module.exports = (opts) => {
	return new Menu(opts)
}
