const Telegraf = require('telegraf')
const textsApp = require('../lang/text')
const menuApp = require('../lang/menu')
const servicesApp = require('../services')
// const { Extra, Markup } = require('telegraf/lib')

const errLog = global.errLog
// const db = global.db

// const NAME = 'bot.js'

class App {
	constructor(opts) {
		this.opts = opts
		this.timerDelay = /* 1 min */ 1.2 * 60 * 1000
		this.userDelay = /* 20 min */ 20 * 60 * 1000
		this.workDelay = /* 1 min */ 1.1 * 60 * 1000
		this.answerCallbackQueryDelay = 5 * 1000
		this.services = servicesApp({ settings: opts, app: this })

		// this.botKey = this.services.getBotKey(opts.bot.username)
		this.botKey = opts.botKey || 0
		this.defaultLang = 'ru'
		this.defaultState = 'start'
		this.defaultTmp = 'tmp'

		this.defaultOpts = {
			botKey: this.botKey,
			botName: opts.bot.username,
			line: '\r\n'
		}

		this.requestParams = {
			method: 'get',
			encoding: 'utf-8',
			timeout: 10000,
			pool: { maxSockets: Infinity },
			followRedirect: false,
			gzip: true
		}

		this.texts = textsApp(this.defaultOpts)
		this.menu = menuApp(this.defaultOpts)

		console.log(this.services.getDT(), 'started bot', opts.bot.username)
		console.log()
	}

	init() {
		this.sessions = {}
		this.storage = {}
		this.timer()

		this.bot = new Telegraf(this.opts.bot.token)
		const bot = this.bot
		// this.Extra = Extra
		// this.Markup = Markup

		// this.dataCache = {}
		const botanToken = this.opts.botan.token

		bot.use((ctx) => {
			let msg

			if (ctx.update) {
				msg = ctx.update.message || ctx.update.callback_query.message || null
			} else {
				return errLog('bot.js', 'init', ctx)
			}

			if (!msg) {
				errLog('empty inside ctx.update, ctx.update=', ctx.update)
			}

			if (this.opts.bot.dev) {
				if (msg.chat.type !== 'private') {
					return
				}
			}

			console.log()
			console.log('=== === ===')
			console.log(this.services.getDT(), ctx.update)

			if (ctx.update.callback_query) {
				console.log('=== callback_query')
				console.log(this.services.getDT(), ctx.update.callback_query.message)
			}

			console.log('===')

			if (this.opts.botan.token) {
				this.services.botanio({
					token: botanToken,
					id: msg.from.id,
					msg
				})
			}

			if (!msg) {
				return errLog('bot.js', 'init', ctx.update)
			}

			const id = this.services.getId({
				fromId: msg.from.id,
				chatId: msg.chat.id
			})

			this.storage[id] = this.storage[id] || []
			this.storage[id].push({ ctx, msg })

			this.sessions[id] = this.sessions[id] || { id }

			const session = this.sessions[id]

			session.data = session.data || []
			this.botInput(session)
		})
			.catch(err => errLog('bot.js', 'init', err))
		bot.startPolling()
	}

	botInput(oldSession) {
		const session = Object.assign({}, oldSession)
		const id = session.id

		// console.log(333, session.inWork,
		// 	session.data.length,
		// 	session.inInput,
		// 	this.storage[id].length
		// )

		if (!(!session.inWork && !session.data.length &&
			!session.inInput && this.storage[id].length)) {
			// console.log(334, 'stop next ctx')
			return
		}

		// console.log(334, 'go')

		const { ctx, msg } = this.storage[id].shift()

		session.msg = msg
		session.ctx = ctx
		session.dataCallback = []
		session.userData = session.userData || {}
		session.isCallbackQuery = !!ctx.update.callback_query
		session.inInput = true
		session.start = new Date()
		session.userInput = session.userInput || {}

		const userInput = session.userInput

		if (msg.text) {
			userInput.commandLine = msg.text.match(/^\/([^\s]+) *(.+)*/) || []
			userInput.command = userInput.commandLine[1] || ''
			userInput.text = (msg.text && !session.dropUserText) ? msg.text : ''
		} else {
			userInput.commandLine = null
			userInput.command = null
			userInput.text = ''
		}

		session.dropUserText = false

		console.log('current session', session.userInput)
		console.log()

		if (session.isCallbackQuery) {
			// this.send(session, {
			// 	type: 'answerCallbackQuery'
			// })
			session.hasAnswerCallbackQuery = false
			session.cbData = JSON.parse(ctx.update.callback_query.data)
		} else {
			if (!session.inWork) {
				this.send(session, {
					type: 'sendChatAction'
				})
			}

			session.cbData = null
		}

		if (msg.chat.type !== 'private') {
			return this.send(session, {
				type: 'sendMessage',
				data: [this.texts.getText(this.defaultLang, 'groupInfo', {
					line: this.defaultOpts.line,
					botName: this.opts.bot.username
				})]
			})
		}

		const stateFunc = this.menu.getMenu('default')

		if (stateFunc) {
			stateFunc({ session, app: this })
		}
	}

	/**
	 * prepare and format send object
	 */
	send(oldSession, opts) {
		const session = Object.assign({}, oldSession)

		if (opts) {
			const {
				type,
				data,
				messageId,
				showAlert,
				callbackQueryId
			} = opts

			const noTyping = [
				'sendChatAction',
				'editMessageText',
				'editMessageReplyMarkup',
				'answerCallbackQuery'
			]

			if (!noTyping.includes(type)) {
				let chatActionText = 'typing'

				switch (type) {
					case 'sendPhoto': {
						chatActionText = 'upload_photo'
						break
					}
					default:
				}

				session.data.push({
					id: session.id,
					type: 'sendChatAction',
					data: chatActionText
				})
			}

			session.data.push({
				id: session.id,
				type,
				data: data || 'typing',
				messageId,
				showAlert,
				callbackQueryId
			})
		}

		if (!(!session.inWork && session.data.length)) {
			if (!session.data.length) {
				// session.inInput = false
				this.botInput(session)
			}

			return
		}

		// console.log(112, 'go')

		const item = session.data.shift()

		// console.log(222, item, session.inWork, session.data.length)

		// item.ctx = session.ctx
		session.inWork = true

		let replyName

		switch (item.type) {
			case 'sendMessage':
				replyName = 'replyWithHTML'
				break
			case 'sendChatAction':
				replyName = 'replyWithChatAction'
				break
			case 'sendPhoto':
				replyName = 'replyWithPhoto'
				break
			case 'editMessageReplyMarkup':
			case 'editMessageText':
			case 'answerCallbackQuery':
				replyName = item.type
				break
			default:
				errLog('bot.js send', 'default case', item.type)
				this.next(session)
		}

		if (replyName && ['sendMessage'].indexOf(item.type) > -1) {
			const data = item.data
			let dataToSend
			let dataToSend2

			if (typeof data !== 'string' &&
				typeof data[0] === 'object' &&
				data[0].length > 1 &&
				data.length === 3) {
				// send keyboard
				dataToSend = [data[0].shift(), data[2]]
				dataToSend2 = [data[0], data[1]]

				session.data.unshift({
					type: item.type,
					data: dataToSend2
				})

				item.data = dataToSend
				// send inline
			} else if (typeof data === 'object') {
				item.data = [data[0], data[1]]
			}

			// const messageId = (opts) ? opts.messageId : null
			// console.log(334, opts)
			// this.reply(item, replyName, item)
			this.reply(session, item, replyName)
		}
	}

	/*
	 * use telegram-framework here, send
	 */
	reply(oldSession, item, func) {
		const session = Object.assign({}, oldSession)

		const data = item.data
		let text
		let markup

		switch (item.type) {
			case 'sendMessage':
			case 'sendChatAction':
			case 'editMessageText':
			case 'editMessageReplyMarkup':
			case 'answerCallbackQuery':
				if (data) {
					if (typeof data === 'string') {
						text = data
					} else {
						markup = data[1]
						if (typeof data[0] === 'string') {
							text = data[0]
						} else {
							text = data[0].join(this.defaultOpts.line)
						}
					}
				}
				break

			case 'sendPhoto':
				if (typeof data === 'string') {
					text = data
				} else {
					text = data[0]
					markup = data[1]
				}
				break

			default:
				return errLog('bot.js - reply', 'no item.type', item.type)
		}

		if (!session.hasAnswerCallbackQuery && new Date() - session.start > this.answerCallbackQueryDelay) {
			session.hasAnswerCallbackQuery = true

			this.send(session, {
				type: 'answerCallbackQuery'
			})
		}

		// send
		switch (func) {
			case 'answerCallbackQuery':
				session.hasAnswerCallbackQuery = true

				if (item.callbackQueryId) {
					// console.log(11, item, text)
					//										   callbackQueryId, text, url, showAlert, cacheTime
					this.bot.telegram.answerCallbackQuery(item.callbackQueryId, text, undefined, !!item.showAlert)
						.catch(err => errLog('bot.js reply', func, err))
						.then(res => this.next(session, res, text, markup))
				} else {
					// console.log(22)
					session.ctx[func]()
						.catch(err => errLog('bot.js reply', func, err))
						.then(res => this.next(session, res, text, markup))
				}
				break

			case 'editMessageReplyMarkup':
				// console.log(33, item)
				this.bot.telegram.editMessageReplyMarkup(item.id, item.messageId, undefined, markup.reply_markup)
					.catch(err => errLog('bot.js reply', func, err))
					.then(res => this.next(session, res, text, markup))
				break

			case 'editMessageText':
				this.bot.telegram.editMessageText(item.id, item.messageId, undefined, text, markup)
					.catch(err => errLog('bot.js reply', func, err))
					.then(res => this.next(session, res, text, markup))
				break

			default:
				session.ctx[func](text, markup)
					.catch(err => errLog('bot.js reply', func, err))
					.then(res => this.next(session, res, text, markup))
		}
	}

	next(session, res, text, markup) {
		// const session = this.sessions[id]
		this.catchAnswer(session, res, text, markup)
	}

	catchAnswer(oldSession, res, text, markup) {
		const session = Object.assign({}, oldSession)
		// const session = this.sessions[id]

		// console.log()
		// console.log()
		// console.log('catchAnswer', session.id, res, !!text, !!markup)
		// console.log()

		if (!res) {
			errLog('catchAnswer', '!res', { id: session.id, res, text, markup })
		}

		session.inWork = false
		this.send(session)
	}

	static dropUserText(oldSession) {
		const session = Object.assign({}, oldSession)

		// const session = this.sessions[id]
		session.userInput = {}
		session.dropUserText = false

		return session
	}

	runState(oldSession) {
		const session = Object.assign({}, oldSession)

		// const session = this.sessions[id]
		if (!session) {
			return errLog('bot.js', 'no session')
		}

		const userInput = session.userInput

		if (!session.state) {
			errLog('bot.js', 'no state, get `start` by default', session.state)
			session.stateOld = this.defaultState
			session.state = this.defaultState
		}

		let onceState
		let newState

		if (userInput.text) {
			// need for '/commands' ?
			if (!session.dropUserText && this.menu.checkCommand(userInput.command)) { //  && !session.priority
				session.stateOld = session.state
				session.state = userInput.command
				session.dropUserText = true
				this.dropUserText(session)
				// console.log('state changed (1) from', session.stateOld, 'to', userInput.command)
			}

			if (session.lang) {
				// check keyboard callback
				let textState
				[textState, newState] = this.menu.checkKeyboardAccepted(session.lang, session.state, userInput.text)
				textState += ''

				if (newState) {
					if (newState !== session.state) {
						session.stateOld = session.state
						session.state = newState
						session.dropUserText = true
						this.dropUserText(session)
					}
				} else {
					onceState = textState
				}
			}
		}

		if (session.dropUserText) {
			this.dropUserText(session)
		}

		let stateFunc = this.menu.getMenu(session.state)

		if (!stateFunc) {
			session.stateOld = session.state
			session.state = this.defaultState
			stateFunc = this.menu.getMenu(session.state)
			// console.log('state changed (2) from', session.stateOld, 'to', this.defaultState)
		}

		if (session.stateOld !== session.state) {
			this.services.saveState(session.id)
				.catch(err => errLog('bot.js', 'save new state', err))
		}

		if (stateFunc && !onceState) {
			// console.log(NAME, 345)
			stateFunc({ session, app: this })
				.then(() => {
					// console.log(NAME, 456)
					session.inInput = false
					this.botInput(session)
				})
				.catch(err => errLog(err))
		} else {
			if (onceState) {
				this.send(session, {
					type: 'sendMessage',
					data: this.texts.getFrameText(session.lang, onceState)
				})
			}

			this.send(session, {
				type: 'sendMessage',
				data: this.texts.getFrameText(session.lang, session.state)
			})

			session.inInput = false
			this.botInput(session)
		}
	}

	timer() {
		// console.log('timer start')
		const now = new Date()
		const count = {
			session: 0,
			killed: 0,
			was: 0
		}

		Object.keys(this.sessions).forEach((key) => {
			const session = this.sessions[key]

			// if (now - this.userDelay > session.ping) {
			if (now - this.userDelay > session.ping) {
				count.killed++

				if (session.inWork) {
					errLog('timer', 'still inWork', key)
				}

				delete this.sessions[key]
			} else {
				count.session++
			}
			// console.log(88, key, session.inWork)

			if (session.inWork && now - this.workDelay > session.ping) {
				console.log('timer', 'user', `${key} session.inWork = ${session.inWork}`)
				console.log(`is ON !#!#! queue = ${session.data.length}`)
				session.inWork = false
				this.send(session)
			}

			count.was++
		})

		if (count.was > 0) {
			console.log(this.services.getDT(), 'users in memory', count)
		}

		setTimeout(() => this.timer(), this.timerDelay)
		// console.log('timer end')
	}
}

module.exports = (opts) => {
	if (!opts) {
		return errLog('bot', 'exports', 'no opts')
	}

	return new App(opts)
}
