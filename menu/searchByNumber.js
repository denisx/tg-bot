function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on action', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'back'
	switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		case 'back':
			menu.path = 'autoMenu'
			menu.dropCommand = true
			return self.parseText(id)

		case 'garage':
			menu.path = 'garage'
			menu.dropCommand = true
			return self.parseText(id)

		case 'settings':
			menu.path = 'settings'
			menu.dropCommand = true
			return self.parseText(id)

		default:
			return self.services.searchByNumber({
					userId: menu.msg.from.id,
					numberId: menu.numberObj.numberId,
					menu: menu
				})
				.then((rows) => {
					if (rows) {
						menu.answer = 'Найдено мобильных: ' + rows.length + menu.texts.vars.newLine
						if (rows.length) {
							rows.forEach((row) => {
								menu.answer +=
									row.mobile.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})$/, '+$1 ($2) $3-$4-$5') +
									menu.texts.vars.newLine
								self.bot.sendContact({
									chat_id: menu.msg.from.id,
									phone_number: row.mobile,
									first_name: menu.texts.searchByNumberOwner,
									last_name: menu.numberObj.number
								}, (err, data) => {
								})
							})
						} else {
							// menu.answer = menu.texts.searchEmpty
							// menu.answer += menu.texts
						}
					} else {
						menu.answer = menu.texts.cannotSearchByNumber()
					}
					self.commandAnswer(id)
				})
				.catch((err) => {
					console.error(self.services.getDT(), 'searchByNumber', 'err', err)
				})
			// menu.answer = menu.texts.actionText()
			// self.commandAnswer(id)
	}
}

module.exports = f
