// The Hack https://github.com/joelabair
process.env.NODE_PATH = __dirname

require('module').Module._initPaths()

function getDT(dt) {
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

global.DEV = false

global.errLog = (name, desc, err, cb) => {
	console.error(getDT(), name, desc, err)
	if (cb && typeof cb === 'function') {
		cb(err)
	}
}

const errLog = global.errLog

global.log = (file, name, a, b, c) => {
	console.log(file || '', name || '', a || '', b || '', c || '')
}

global.homePath = __dirname

const os = require('os')

const hostname = os.hostname()

console.log()
console.log()
console.log(getDT(), 'started server at', hostname)

const settings = {
	tgBot: require('./settings')[hostname]
}

global.SYSErr = (err) => {
	let data = {}

	errLog('server.js', 'global.SYSErr', err)

	switch (err.code) {
		case 'ER_ACCESS_DENIED_ERROR': {
			data = 'DB_ACCESS_DENIED'
			break
		}
		case 'ENOENT': {
			data = 'DB_CONNECT_ERROR'
			break
		}
		case 'ER_PARSE_ERROR': {
			data = 'DB_QUERY_ERROR'
			break
		}
		default: {
			data = 'COMMON_ERROR'
		}
	}

	return data
}

process.on('uncaughtException', (err) => {
	errLog('process.on', 'uncaughtException', err)
	// if (!app.status()) {
	// app.reuse()
	// }
})

let app

global.db = require('db-mysql-async')(settings.tgBot.mysql.connection)

const start = async function() {
	const connection = await global.db
		.getConnection()
		.catch(err => errLog('connection', 'db', err))

	if (!connection) {
		return
	}

	app = require('./bot/bot')(settings.tgBot)
	app.init()
}

start().catch(err => errLog('start', err))
