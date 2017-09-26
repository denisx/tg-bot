const Telegraf = require('telegraf')
const textsApp = require('../lang/text')
const menuApp = require('../lang/menu')
const servicesApp = require('../services')

const NAME = 'bot.js'
const DEV = global.DEV || false
const LOG = global.LOG || false

// const { Extra, Markup } = require('telegraf/lib')

const errLog = global.errLog
// const db = global.db

class App {
	constructor(opts) {
		DEV && console.log(NAME, 'App() constructor', Object.keys(opts))

		this.opts = opts
		this.timerDelay = /* 1 min */ 1.2 * 60 * 1000
		this.userDelay = /* 20 min */ 20 * 60 * 1000
		this.workDelay = /* 1 min */ 1.1 * 60 * 1000
		this.answerCallbackQueryDelay = 5 * 1000
		this.services = servicesApp({ settings: opts, app: this })

		this.defaultLang = 'ru'
		this.defaultState = 'start'
		this.defaultTmp = 'tmp'

		this.defaultOpts = {
			botName: opts.bot.username,
			br: '\r\n',
			nbsp: '\u00A0'
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

		this.texts.setOpts({ menu: this.menu })
		this.menu.setOpts({ texts: this.texts })

		LOG && console.log(NAME, 'constructor()', this.services.getDT(), opts.bot.username)
		LOG && console.log()
	}
	// end constructor

	async init() {
		this.sessions = {}
		this.storage = {}
		// this.timer()

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

				// console.log()
				// console.log(333, ctx.update)
				// console.log()
			} else {
				return errLog(NAME, 'init', ctx)
			}

			if (!msg) {
				errLog(NAME, 'empty inside ctx.update, ctx.update=', ctx.update)
			}

			if (this.opts.bot.dev) {
				if (msg.chat.type !== 'private') {
					return
				}
			}

			LOG && console.log()
			LOG && console.log(NAME, '=== === ===')
			LOG && console.log(NAME, 'init()', this.services.getDT(), ctx.update)

			if (ctx.update.callback_query) {
				LOG && console.log(NAME, '=== callback_query')
				LOG && console.log(NAME, 'init()', this.services.getDT(), ctx.update.callback_query.message)
			}

			LOG && console.log(NAME, '===')

			if (this.opts.botan.token) {
				this.services.botanio({
					token: botanToken,
					id: msg.from.id,
					msg
				})
			}

			if (!msg) {
				return errLog(NAME, 'init', ctx.update)
			}

			const id = this.services.getId({
				fromId: ctx.update.callback_query ? msg.chat.id : msg.from.id,
				chatId: msg.chat.id
			})

			this.storage[id] = this.storage[id] || []
			this.storage[id].push({ ctx, msg })

			this.sessions[id] = this.sessions[id] ||
				{
					id,
					settings: {},
					inWork: false
				}

			const session = this.sessions[id]

			session.data = session.data || []

			this.botInput(id)
				.catch(err => errLog(NAME, 'this.botInput()', err))
		})
			.catch(err => errLog(NAME, 'init', err))

		bot.startPolling()
	}
	// end init

	async botInput(id) {
		DEV && console.log(NAME, 'start botInput()')
		const session = this.sessions[id]

		// DEV && console.log(333, session.inWork,
		// 	session.data.length,
		// 	session.inInput,
		// 	this.storage[id].length
		// )

		if (session.inWork ||
			session.data.length ||
			session.inInput ||
			!this.storage[id].length
		) {
			return
		}

		const { ctx, msg } = this.storage[id].shift()

		session.msg = msg
		session.ctx = ctx
		session.dataCallback = []
		session.userData = session.userData || {}
		session.isCallbackQuery = !!ctx.update.callback_query
		session.inInput = true
		session.dtStart = new Date()
		session.userInput = session.userInput || {}

		const userInput = session.userInput

		if (msg.text) {
			userInput.commandLine = msg.text.match(/^\/([^\s]+) *(.+)*/) || []
			userInput.command = userInput.commandLine[1] || ''
			userInput.text = !session.dropUserText ? msg.text : ''
		} else {
			userInput.commandLine = null
			userInput.command = null
			userInput.text = ''
		}

		session.dropUserText = false

		DEV && console.log(NAME, 'botInput()', 'current session', session.userInput)
		DEV && console.log(NAME, 'botInput()', 'current state', session.state)
		DEV && console.log()

		if (session.isCallbackQuery) {
			// this.send(id, {
			// 	type: 'answerCallbackQuery'
			// })
			// 	.catch(err => errLog(NAME, 'this.send()', err))

			// console.log(222, ctx.update.callback_query.data)

			session.hasAnswerCallbackQuery = false
			session.cbData = JSON.parse(ctx.update.callback_query.data)
		} else {
			if (!session.inWork) {
				await this.send(id, {
					type: 'sendChatAction'
				})
					.catch(err => errLog(NAME, 'this.send()', err))
			}

			session.cbData = null
		}

		if (msg.chat.type !== 'private') {
			const sendRes = await this.send(id, {
				type: 'sendMessage',
				data: [this.texts.getText(this.defaultLang, 'groupText',
					{
						line: this.defaultOpts.line,
						botName: this.opts.bot.username
					}
				)]
			})
				.catch(err => errLog(NAME, 'this.send()', err))

			return sendRes
		}

		const stateFunc = this.menu.getMenu('default')

		if (stateFunc) {
			DEV && console.log(NAME, 'botInput()', 'run state func', 'default')
			await stateFunc({ id, app: this })
				.catch(err => errLog(NAME, 'stateFunc', err))
			DEV && console.log(NAME, 'botInput()', 'end state func', 'default')
		}

		return Promise.resolve()
	}
	// end botInput

	/**
	 * prepare and format send object
	 */
	async send(id, opts) {
		DEV && console.log(NAME, 'start send()')

		const session = this.sessions[id]

		// put data to base, if it is
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
				let chatActionText

				switch (type) {
					case 'sendPhoto': {
						chatActionText = 'upload_photo'
						break
					}

					case 'sendMessage': {
						chatActionText = 'typing'
						break
					}

					default: {
						errLog(NAME, 'not approved type, chatActionText=', chatActionText)
						chatActionText = 'typing'
					}
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

		DEV && console.log(NAME, 'send(), check - inWork, data', session.inWork, session.data.length)

		if (session.inWork || session.data.length === 0) {
			if (session.data.length === 0) {
				// session.inInput = false
				await this.botInput(id)
					.catch(err => errLog(NAME, 'botInput', err))
			}

			DEV && console.log(NAME, 'send() return 3948', session.inWork, session.data.length)
			return Promise.resolve()
		}

		const item = session.data.shift()

		session.inWork = true

		let replyName

		DEV && console.log(NAME, 'send(), switch item.type', item.type)
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
				errLog(NAME, 'default case', 'bot.js send "item.type"', item.type)
				this.next(id)
				return Promise.resolve()
		}

		if (replyName && ['sendMessage'].includes(item.type)) {
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
		}

		const replyRes = await this.reply(id, item, replyName)
			.catch(err => errLog(NAME, 'this.reply()', err))

		DEV && console.log(NAME, 'end send()')
		return replyRes
	}
	// end send

	/*
	 * use telegram-framework here, send
	 */
	async reply(id, item, func) {
		DEV && console.log(NAME, 'start reply()')

		const session = this.sessions[id]
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
				return errLog(NAME, 'bot.js - reply', 'no item.type', item.type)
		}

		DEV && console.log(NAME, 'reply()', func)

		if (session.isCallbackQuery &&
			!session.hasAnswerCallbackQuery &&
			new Date() - session.dtStart > this.answerCallbackQueryDelay) {

			session.hasAnswerCallbackQuery = true

			await this.send(id, {
				type: 'answerCallbackQuery'
			})
				.catch(err => errLog(NAME, 'this.send()', err))
		}

		// send
		switch (func) {
			case 'answerCallbackQuery': {
				session.hasAnswerCallbackQuery = true

				if (item.callbackQueryId) {
					// DEV && console.log(11, item, text)
					//										callbackQueryId, text, url, showAlert, cacheTime
					const res = await this.bot
						.telegram.answerCallbackQuery(item.callbackQueryId, text, undefined, !!item.showAlert)
						.catch(err => errLog(NAME, 'this.bot.telegram.answerCallbackQuery()', err))

					this.next(id, res, text, markup)
				} else {
					const res = await session.ctx[func]()
						.catch(err => errLog(NAME, 'session.ctx[func]()', err))

					this.next(id, res, text, markup)
				}

				break
			}

			case 'editMessageReplyMarkup': {
				const res = await this.bot
					.telegram.editMessageReplyMarkup(item.id, item.messageId, undefined, markup.reply_markup)
					.catch(err => errLog(NAME, 'this.bot.telegram.editMessageReplyMarkup()', err))

				this.next(id, res, text, markup)
				break
			}

			case 'editMessageText': {
				const res = await this.bot
					.telegram.editMessageText(item.id, item.messageId, undefined, text, markup)
					.catch(err => errLog(NAME, 'this.bot.telegram.editMessageText()', err))

				this.next(id, res, text, markup)

				break
			}

			default: {
				LOG && console.log('state =', session.state)

				const res = await session.ctx[func](text, markup)
					.catch(err => errLog(NAME, 'session.ctx[func]', err))

				this.next(id, res, text, markup)
			}
		}

		DEV && console.log(NAME, 'end reply()')
		Promise.resolve()
	}
	// end reply

	// next step, log server answer
	next(id, res, text, markup) {
		DEV && console.log(NAME, 'start next() step')

		// break all cover resolvers
		// setTimeout(() => {
		this.catchAnswer(id, res, text, markup)
		// }, 10)
	}
	// end next

	catchAnswer(id, res, text, markup) {
		// const session = this.sessions[id]

		// DEV && console.log()
		// DEV && console.log()
		// DEV && console.log('catchAnswer', session.id, res, !!text, !!markup)
		// DEV && console.log()
		if (!res) {
			errLog(NAME, 'catchAnswer', '!res', { id, res, text, markup })
		}

		const session = this.sessions[id]

		session.inWork = false
		this.send(id)
			.catch(err => errLog(NAME, 'catchAnswer(), this.send', err))
	}
	// end catchAnswer

	dropUserText(id) {
		const session = this.sessions[id]

		// const session = this.sessions[id]
		session.userInput = {}
		session.dropUserText = false
	}
	// end dropUserText

	async runState(id) {
		const session = this.sessions[id]
		DEV && console.log(NAME, 'start runState()', session.state)

		if (!session) {
			return errLog(NAME, 'no session')
		}

		// if (session.state != 'default') {
		// 	return Promise.resolve()
		// }

		if (session.dropUserText) {
			this.dropUserText(id)
		}

		const userInput = session.userInput

		if (!session.state) {
			errLog(NAME, 'no state, get `start` by default', session.state)
			session.stateOld = this.defaultState
			session.state = this.defaultState
		}

		if (!session.stateOld) {
			session.stateOld = session.state
		}

		let onceState
		let newState

		if (userInput && userInput.text) {
			// need for '/commands' ?
			if (!session.dropUserText &&
				userInput.command &&
				this.menu.checkCommand(userInput.command)) {

				// && !session.priority
				session.stateOld = session.state
				session.state = userInput.command
				session.dropUserText = true
				this.dropUserText(id)
				// DEV && console.log('state changed (1) from', session.stateOld, 'to', userInput.command)
			}

			if (session.lang) {
				// check keyboard callback
				let textState

				[textState, newState] = this.menu.checkKeyBoardAcceptedBySession(session)
				textState = textState || null // foo line, to disable prev line, eslint

				// console.log(888, textState, newState)

				if (newState) {
					if (newState !== session.state) {
						session.stateOld = session.state
						session.state = newState
						session.dropUserText = true
					}
				} else {
					onceState = textState
				}
			}
		}

		if (session.dropUserText) {
			this.dropUserText(id)
		}

		let stateFunc

		if (session.state) {
			stateFunc = this.menu.getMenu(session.state)
		}

		if (!stateFunc) {
			session.stateOld = session.state
			session.state = this.defaultState
			stateFunc = this.menu.getMenu(session.state)
			// DEV && console.log('state changed (2) from', session.stateOld, 'to', this.defaultState)
		}

		// console.log(777, session.stateOld, session.state, onceState)

		if (session.stateOld && session.stateOld !== session.state) {
			this.services.saveState(session.id)
				.catch(err => errLog(NAME, 'save new state', err))
		}

		if (stateFunc && !onceState) {
			DEV && console.log(NAME, 'runState', 345, session.state)
			await stateFunc({ id, app: this })
				.catch(err => errLog(NAME, 'stateFunc', err))

			session.inInput = false
			await this.botInput(id)
				.catch(err => errLog(NAME, 'botInput', err))
		} else {
			DEV && console.log(NAME, 'runState', 346, onceState)
			if (onceState) {
				DEV && console.log(NAME, 'runState', 347, onceState)
				await this.send(id, {
					type: 'sendMessage',
					data: this.texts.getFrameText(session.lang, onceState)
				})
					.catch(err => errLog(NAME, 'this.send()', err))
			}

			await this.send(id, {
				type: 'sendMessage',
				data: this.texts.getFrameTextBySession(session)
			})
				.catch(err => errLog(NAME, 'this.send()', err))

			session.inInput = false
			await this.botInput(id)
				.catch(err => errLog(NAME, 'botInput', err))
		}

		DEV && console.log(NAME, 'runState end')
		return Promise.resolve()
	}
	// end runState

	timer() {
		// DEV && console.log('timer start')
		const now = new Date()
		const count = {
			session: 0,
			killed: 0,
			was: 0
		}

		Object.keys(this.sessions).forEach((id) => {
			const session = this.sessions[id]

			// if (now - this.userDelay > session.ping) {
			if (now - this.userDelay > session.ping) {
				count.killed++

				if (session.inWork) {
					errLog(NAME, 'timer', 'still inWork', id)
				}

				delete this.sessions[id]
			} else {
				count.session++
			}
			// DEV && console.log(88, key, session.inWork)

			if (session.inWork && now - this.workDelay > session.ping) {
				DEV && console.log(NAME, 'timer', 'user', `${id} session.inWork = ${session.inWork}`)
				DEV && console.log(NAME, `is ON !#!#! queue = ${session.data.length}`)
				session.inWork = false
				this.send(id)
					.catch(err => errLog(NAME, 'this.send()', err))
			}

			count.was++
		})

		if (count.was > 0) {
			DEV && console.log(NAME, this.services.getDT(), 'users in memory', count)
		}

		setTimeout(() => this.timer(), this.timerDelay)
		// DEV && console.log('timer end')
	}
	// end timer
}

module.exports = (opts) => {
	if (!opts) {
		return errLog(NAME, 'bot', 'exports', 'no opts')
	}

	return new App(opts)
}
