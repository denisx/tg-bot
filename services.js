const NAME = 'services.js'

const request = require('request')
const fs = require('fs')

const errLog = global.errLog
const db = global.db

class Services {
	constructor(opts) {
		console.log(NAME, 'Services() constructor', Object.keys(opts))
		this.app = opts.app
	}

	botanio(opts) {
		request({
			method: 'POST',
			url: 'https://api.botan.io/track',
			qs: {
				token: opts.token,
				uid: opts.id, // message.from.id,
				name: opts.name || 'Message'
			},
			json: opts.msg
		}, (err) => {
			if (err) {
				errLog('services', 'botanio', err)
			}
		})
	}

	async getSettings(id) {
		const app = this.app
		const session = app.sessions[id]
		const msg = session.msg

		const query = `SELECT lang, banned, state FROM user
			WHERE chatId = ${msg.chat.id} AND userId = ${msg.from.id}
			LIMIT 1`

		const resSettings = await db
			.sql(query)
			.catch(err => errLog('getSettings', query, err))

		return resSettings[0] || {}
	}

	saveState(id) {
		const app = this.app
		const session = app.sessions[id]

		const query = `UPDATE \`user\`
			SET \`state\` = ${db.escape(session.state)},
				\`updated\` = now()
			WHERE \`chatId\` = ${session.msg.chat.id}`

		return db.sql(query).catch(err => errLog('saveState', query, err))
	}

	saveLang(id) {
		const app = this.app
		const session = app.sessions[id]

		const query = `UPDATE \`user\`
			SET \`lang\` = ${db.escape(session.lang)},
				\`updated\` = now()
			WHERE \`chatId\` = ${session.msg.chat.id}`
		return db.sql(query)
			.catch(err => errLog('saveLang', query, err))
	}

	async saveUser(id) {
		const app = this.app
		const session = app.sessions[id]
		const msg = session.msg

		const query = `INSERT IGNORE INTO \`user\`
			(
			guid,
			userId,
			chatId,
			lang,
			
			userFirstName,
			userLastName,
			userUsername,
			systemLang,
			isBot,
			
			created,
			updated,
			state)
			
			VALUES (
			UUID(),
			${msg.from.id},
			${msg.chat.id},
			${db.escape(session.lang || '')},
			
			${db.escape(msg.from.first_name || '')},
			${db.escape(msg.from.last_name || '')},
			${db.escape(msg.from.username || '')},
			${db.escape(msg.from.language_code || '')},
			${(msg.from.is_bot) ? 1 : 0},
			
			now(),
			now(),
			${db.escape(session.state)}
			)`

		const userAddResult = await db
			.sql(query)
			.catch(err => errLog(NAME, 'saveUser, new user', query, err))

		console.log(NAME, 'saveUser', userAddResult)

		// return await new Promise((resolve, reject) => {
		// 	.catch
		// .then((res) => {
		// 	const query = `UPDATE \`user\`
		// SET
		// lang = ${db.escape(session.lang || '')},
		// userFirstName = ${db.escape(msg.from.first_name || '')},
		// userLastName = ${db.escape(msg.from.last_name || '')},
		// userUsername = ${db.escape(msg.from.username || '')},
		// systemLang = ${db.escape(msg.from.language_code || '')},
		// isBot = ${(msg.from.is_bot) ? 1 : 0},
		// updated = now(),
		// state = ${db.escape(session.state)}
		// WHERE userId = ${msg.from.id} AND chatId = ${msg.chat.id}
		// `
		//
		// db.sql(query).then(() => resolve()).catch(err => errLog('saveUser', query, err, reject))
		// }).catch(err => errLog('saveUser', query, err, reject))
		// })
	}


	getId(opts) {
		const fromId = opts.fromId || ''
		const chatId = opts.chatId || ''
		return `${chatId}/${fromId}`
		// return opts.chatId
	}

	getDT(dt) {
		const now = dt ? new Date(dt) : new Date()

		return [
			now.getFullYear(), '-',
			`0${now.getMonth() + 1}`.slice(-2), '-',
			`0${now.getDate()}`.slice(-2), ' ',
			`0${now.getHours()}`.slice(-2), ':',
			`0${now.getMinutes()}`.slice(-2), ':',
			`0${now.getSeconds()}`.slice(-2)
		].join('')
	}

	inputGeo(opts) {
		const id = opts.id
		const name = opts.name
		const bot = opts.bot
		const menu = opts.menu
		menu.answer = ''
		menu.keyboardPath = 'backSkip'
		menu.requestLocation = true
		switch (menu.command) {
			case 'home':
				menu.path = 'start'
				menu.dropCommand = true
				return bot.parseText(id)

			case 'back':
				menu.path = `see${name}`
				menu.dropCommand = true
				return bot.parseText(id)

			case 'skip':
				this.saveEvent({
					userId: menu.msg.from.id,
					location: {},
					type: menu.eventStatus.type,
					subType: menu.eventStatus.subType
				})
					.then((eventId) => {
						menu.eventId = eventId
						delete menu.requestLocation

						menu.dropCommand = true
						menu.path = `see${name}InputPhoto`
						return bot.parseText(id)
					}).catch(err => errLog('', err))
				break

			default:
				if (menu.msg.location) {
					this.saveEvent({
						userId: menu.msg.from.id,
						location: menu.msg.location,
						type: menu.eventStatus.type,
						subType: menu.eventStatus.subType
					})
						.then((eventId) => {
							menu.eventId = eventId
							delete menu.requestLocation
							menu.answer = menu.texts.getGeoDone
							menu.noNextQueue = true
							bot.commandAnswer(id)

							menu.path = `see${name}InputPhoto`
							return bot.parseText(id)
						}).catch(err => errLog('', '', err))
				} else {
					menu.answer = menu.texts.waitForGeo
					bot.commandAnswer(id)
				}
		}
	}

	inputPhoto(opts) {
		const id = opts.id
		const name = opts.name
		const bot = opts.bot
		const menu = opts.menu

		menu.answer = ''
		menu.keyboardPath = 'back'
		switch (menu.command) {
			case 'home':
				menu.path = 'start'
				menu.dropCommand = true
				return bot.parseText(id)

			case 'back':
				menu.path = `see${name}InputGeo`
				menu.dropCommand = true
				return bot.parseText(id)

			case 'newNumber':
				menu.path = 'newNumber'
				menu.dropCommand = true
				return bot.parseText(id)

			default:

				if (menu.msg.photo) {
					this.savePhoto({
						botName: bot.botName,
						botSelf: bot,
						userId: menu.msg.from.id,
						msg: menu.msg,
						eventId: menu.eventId
					}).catch(err => errLog('', '', err))
					menu.answer = menu.texts.savePhotoDone + menu.texts.v.line +
						menu.texts.waitPhotoMore()
					bot.commandAnswer(id)
				} else {
					menu.answer = `${menu.texts.waitForPhoto} ${(menu.texts[`waitForPhoto${name}`] || '')}`
					bot.commandAnswer(id)
				}
		}
	}


	catchErr(name, query, err, reject) {
		console.error(this.getDT(), name, query, err)

		if (reject) {
			reject(err)
		}
	}

	getUrlContent(opts) {
		return new Promise((resolve, reject) => {
			const rp = opts.requestParams

			rp.uri = opts.url
			rp.encoding = opts.encoding || opts.apiEncoding
			rp.encoding = (rp.encoding === 'null') ? null : rp.encoding

			let body

			body = (rp.encoding) ? '' : new Buffer([])
			request(rp, () => {
			})
				.on('error', err => errLog('getUrlContent', 'request', err, reject))
				.on('data', (chank) => {
					if (typeof chank === 'string') {
						body += chank
					}

					if (typeof chank === 'object') {
						const totalLength = body.length + chank.length
						body = Buffer.concat([body, chank], totalLength)
					}
				})
				.on('end', () => {
					let json

					if (typeof body === 'string') {
						try {
							json = JSON.parse(body)
						} catch (err) {
							errLog(err)
						}
					}
					const data = (opts.dataType === 'json' && json) ? json : body

					if (data) {
						resolve(data)
					} else {
						errLog('getUrlContent', 'request', 'bad data', reject)
					}
				})
		})
	}

	downloadFile(opts) {
		console.log(NAME, 22, opts)
		return new Promise((resolve, reject) => {
			request.head(opts.uri, (err) => {
				if (err) {
					return errLog(NAME, 'downloadFile', err, resolve)
				}
				// console.log('content-type:', res.headers['content-type'])
				// console.log('content-length:', res.headers['content-length'])
				request(opts.uri).pipe(fs.createWriteStream(opts.filename))
					.on('error', pipeErr => errLog(NAME, 'downloadFile', pipeErr, reject))
					.on('close', () => resolve(opts.filename))
			})
		})
	}
}

module.exports = (opts) => {
	if (!opts) {
		return errLog(NAME, 'exports', 'no opts')
	}
	return new Services(opts)
}
