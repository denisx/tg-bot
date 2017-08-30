const NAME = 'start.js'

class Menu {
	constructor(opts) {
		// return new Promise((resolve) => {
		//
		// 	// this.spaceZeroWidth = '\u200C'
		this.app = opts.app
		this.session = opts.session
		//
		// }).catch((err) => {
		// 	errLog(NAME, err)
		// })
		return this.init()
	}

	init() {
		// nav.left.text = texts.getText(session.lang, 'leftNav', {text: nav.left.data + 1})
		const textFrame = texts.getFrameText(this.session.lang, this.session.state)
		let tf = [...textFrame]
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
