class Menu {
	constructor(opts) {
		console.log('constructor - menu/start', opts)

		this.init(opts)
	}

	async init({ id, app }) {
		console.log('start.js, before send message')
		// const session = app.sessions[id]
		// const textFrame = app.texts.getFrameTextBySession(session)
		// const tf = [...textFrame]

		// console.log(tf)


		// const sendRes = await app.send(id, {
		// 	type: 'sendMessage',
		// 	data: tf
		// }) .catch

		console.log('start.js, after send message')
		// return sendRes
		return Promise.resolve()
	}
}

module.exports = (opts) => {
	return new Menu(opts)
}
