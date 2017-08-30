function f (id) {
	function defaultCase() {

		var userInput = ''
		var searchNumberHere
		var number
		var numberObj
		var msg
		var matchInput = 0

		if ((menu.userText[0] == 'n' || menu.userText == 'prevpage' || menu.userText == 'nextpage')
			|| menu.selected.step && menu.selected.step == 'allMessages' &&
			['m', 'o'].indexOf(menu.userText[0]) == -1
		) {
			matchInput = 1
			console.log(self.services.getDT(), id, matchInput)

			searchNumberHere = menu.userText
			if (menu.userText == 'nextpage') {
				menu.selected.pageN++
				searchNumberHere = menu.selected.numberObj.number
			}
			if (menu.userText == 'prevpage') {
				menu.selected.pageN--
				if (menu.selected.pageN < 0) {
					menu.selected.pageN = 0
				}
				searchNumberHere = menu.selected.numberObj.number
			}

			userInput = searchNumberHere.replace(/^(?:n_)?([a-zа-яё0-9]+)$/i, '$1')
			number = (userInput && userInput.length > 1 && userInput[1] != '_') ?
				userInput :
				menu.selected.numberObj.number

			menu.selected.step = 'allMessages'

			numberObj = self.services.getNumber({number: number})
			if (numberObj) { // return msg for selected number
				return self.services.getMsgToMeByNumber({
					id: menu.msg.from.id,
					menu: menu,
					number: numberObj.number,
					pageN: menu.selected.pageN,
					onPage: menu.selected.onPage
				})
					.then((rows) => {
						if (rows.length) {
							menu.selected.numberObj = numberObj
							if (menu.selected.pageN > 0) {

								menu.answer += menu.texts.prevPage() + menu.texts.vars.newLine
								menu.answer += menu.texts.page + ' ' + (menu.selected.pageN + 1) +
									menu.texts.vars.newLine
							}
							rows.forEach((row) => {
								/**
								 * @param row[Object]
								 * @param row.id[Number]
								 * @param row.read[Number]
								 */
								menu.answer += '/m_' + row.id + ' ' +
									(row.read ? '' : '<b>') +
									self.services.getUserDT(row.created, menu.texts) +
									(row.read ? '' : '</b>') +
									menu.texts.vars.newLine
							})
							if (rows.length == menu.selected.onPage) {
								menu.answer += menu.texts.nextPage() + menu.texts.vars.newLine
							}
						} else {
							menu.answer = menu.texts.noMsg + ' ' + menu.texts.addMoreNumbers()
						}
						self.commandAnswer(id)
					})
					.catch((err) => {
						console.error(self.services.getDT(), id, 'getMsgToMeByNumber', 'err', err)
					})
			} else {
				menu.answer = menu.texts.numberCommandErr
				delete menu.selected
				menu.noNextQueue = true
				self.commandAnswer(id)

				menu.path = 'msgToMe'
				return self.parseText(id)
			}
		}

		if ((menu.userText == 'private' || menu.userText == 'prevpage' || menu.userText == 'nextpage')
			|| menu.selected.step && menu.selected.step == 'privateMessages' &&
			['m', 'o'].indexOf(menu.userText[0]) == -1
		) {
			matchInput = 3
			console.log(self.services.getDT(), id, matchInput)

			if (menu.userText == 'nextpage') {
				menu.selected.pageN++
			}
			if (menu.userText == 'prevpage') {
				menu.selected.pageN--
				if (menu.selected.pageN < 0) {
					menu.selected.pageN = 0
				}
			}
			menu.selected.step = 'privateMessages'

			return self.services.getMsgToMePrivate({
				id: menu.msg.from.id,
				menu: menu,
				pageN: menu.selected.pageN,
				onPage: menu.selected.onPage
			})
				.then((rows) => {
					if (rows.length) {
						if (menu.selected.pageN > 0) {
							menu.answer += menu.texts.prevPage() + menu.texts.vars.newLine
							menu.answer += menu.texts.page + ' ' + (menu.selected.pageN + 1) +
								menu.texts.vars.newLine
						}
						rows.forEach((row) => {
							/**
							 * @param row[Object]
							 * @param row.id[Number]
							 * @param row.read[Number]
							 */

							menu.answer +=
								'/o_' + row.id + ' ' +
								(row.read ? '' : '<b>') +
								self.services.getUserDT(row.created, menu.texts) +
								(row.read ? '' : '</b>') +
								menu.texts.vars.newLine
						})
						if (rows.length == menu.selected.onPage) {
							menu.answer += menu.texts.nextPage() + menu.texts.vars.newLine
						}
					} else {
						menu.answer = menu.texts.noMsg + ' ' + menu.texts.addMoreNumbers()
					}
					self.commandAnswer(id)
				})
				.catch((err) => {
					console.error(self.services.getDT(), id, 'getMsgToMePrivate', 'err', err)
				})
		}

		if (menu.userText[0] == 'm'
			|| menu.selected.step && menu.selected.step == 'selectedMsg'
		) {
			matchInput = 4

			userInput = menu.userText.replace(/^m_(\d+)$/, '$1')
			msg = (!isNaN(parseInt(userInput))) ? userInput : (menu.selected && menu.selected.msg ? menu.selected.msg.id : 0)
			if (!msg) {
				console.error(self.services.getDT(), id, 'userInput bug', userInput, menu.selected)
			}

			menu.selected.step = 'selectedMsg'

			return self.services.getMsgById({
				msgId: msg,
				userId: menu.msg.from.id
			})
				.then((row) => {
					if (row) {
						menu.selected.msg = row
						menu.answer += '(id ' + row.id + ') ' + menu.texts.forNumber + ' ' + menu.selected.numberObj.number + ' ' +
							menu.texts.vars.newLine +
							self.services.getUserDT(row.created, menu.texts) +
							menu.texts.vars.newLines + row.text +
							menu.texts.vars.newLines +
							menu.texts.makePrivateAnswer()
						self.commandAnswer(id)

						self.services.setRead({
							msgId: row.id,
							userId: menu.msg.from.id
						})
					} else {
						menu.answer += menu.texts.authErr
						self.commandAnswer(id)
					}
				})
				.catch((err) => {
					console.error(self.services.getDT(), id, 'getMsgById', 'err', err)
				})
		}

		if (menu.userText[0] == 'o'
			|| menu.selected.step && menu.selected.step == 'privateMsg'
		) {
			matchInput = 5
			console.log(self.services.getDT(), id, matchInput)

			userInput = menu.userText.replace(/^o_(\d+)$/, '$1')
			msg = (!isNaN(parseInt(userInput))) ? userInput : menu.selected.msg.id

			menu.selected.step = 'privateMsg'

			return self.services.getMsgByIdPrivate({
				msgId: msg,
				userId: menu.msg.from.id
			})
			/**
			 * @param {Object} row
			 * @param {int} row.byId
			 * @param {time} row.byCreated
			 * @param {time} row.byText
			 */
				.then((row) => {
					console.log(self.services.getDT(), id, 23, row)
					if (row) {
						menu.selected.msg = row
						menu.answer += menu.texts.inAnswer + ' (' + row.byId + ') ' +
							self.services.getUserDT(row.byCreated, menu.texts) + menu.texts.vars.newLine +
							row.byText + menu.texts.vars.newLines + menu.texts.youGetAnswer +
							' (' + row.id + ') ' + self.services.getUserDT(row.created, menu.texts) +
							menu.texts.vars.newLine + row.text + menu.texts.vars.newLines +
							menu.texts.makePrivateAnswer()
						self.commandAnswer(id)

						self.services.setRead({
							msgId: row.id,
							userId: menu.msg.from.id
						})
					} else {
						menu.answer += menu.texts.authErr
						self.commandAnswer(id)
					}
				})
				.catch((err) => {
					console.error(self.services.getDT(), id, 'getMsgByIdPrivate', 'err', err)
				})
		}

		if (!menu.selected.step ||
			menu.selected.step && menu.selected.step == 'allNumbers'
		) {
			matchInput = 6
			console.log(self.services.getDT(), id, matchInput)

			menu.selected.pageN = 0
			menu.selected.step = 'allNumbers'
			return Promise.all([
				self.services.getMsgCountToMeByNumber({
					id: menu.msg.from.id,
					menu: menu
				}),
				self.services.getMsgCountToMePrivate({
					id: menu.msg.from.id,
					menu: menu
				})
			])
				.then((res) => {
					var rows
					if (res[0]) {
						rows = res[0]
						if (rows.length) {
							menu.answer += menu.texts.readUnread + menu.texts.vars.newLine
							rows.forEach((row) => {
								/**
								 @param row[Object]
								 @param row.countUnread[number]
								 @param row.count[number]
								 */
								menu.answer += menu.texts.forNumber + ' /n_' + row.number + ' ' +
									menu.texts.messages.toLowerCase() + ': <b>' + row.countUnread + '</b>' +
									' (' + row.count + ')' +
									menu.texts.vars.newLine
							})
						}
					}
					if (res[0] && res[0].length && res[1] && res[1].length) {
						menu.answer += menu.texts.vars.newLine
					}
					if (res[1]) {
						rows = res[1]
						if (rows.length) {
							menu.answer += menu.texts.privateMsgs + menu.texts.vars.newLine
							rows.forEach((row) => {
								menu.answer += '/private <b>' + row.countUnread + '</b>' +
									' (' + row.count + ')' + menu.texts.vars.newLine
							})
						}
					}
					if (!(res[0] && res[0].length || res[1] && res[1].length)) {
						menu.answer += menu.texts.vars.addMoreNumbers()
					}
					self.commandAnswer(id)
				})
				.catch((err) => {
					console.error(self.services.getDT(), id, 'allNumbers', 'err', err)
				})
		}

		if (!matchInput) {
			delete menu.selected
			menu.path = 'messages'
			menu.dropCommand = true
			menu.answer = menu.texts.botError
			return self.parseText(id)
		}

	}

	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on msgToMe', menu.userText)
	menu.answer = ''
	// menu.keyboardPath = 'msgToMe'
	menu.selected = menu.selected || {}
	menu.selected.onPage = 10
	switch (menu.command) {
		case 'home':
			delete menu.selected
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'makePrivateAnswer':
			menu.path = 'makePrivateAnswer'
			// menu.dropCommand = true
			return self.parseText(id)
		case 'msgToMe':
		case 'back':
			switch (menu.selected.step) {

				case 'allMessages':
					menu.selected.step = 'allNumbers'
					break

				case 'selectedMsg':
				case 'privateMessages':
					menu.selected.step = 'allMessages'
					break

				case 'privateMsg':
					menu.selected.step = 'privateMessages'
					break

				case 'allNumbers':
				default:

					delete menu.selected
					menu.path = 'messages'
					menu.dropCommand = true
					return self.parseText(id)
			}
			menu.answer = ''
			defaultCase()
			break

		default:
			menu.answer = ''
			defaultCase()
	}
}

module.exports = f
