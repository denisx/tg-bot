function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on removeNumber', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'removeNumber'
	switch (menu.command) {
		case 'back':
			menu.path = 'garage'
			menu.dropCommand = true
			return self.parseText(id)

		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		// case 'notMyAuto':
		// 	break

		case 'removeNumber':
			self.services.saveUserToNumber({
				id: menu.msg.from.id,
				numberId: menu.removeNumber.id,
				isMy: 0
			})
				.catch((err) => {
					console.error(self.services.getDT(), id, 'saveUserToNumber', 'err', err)
				})
			delete menu.removeNumber

			// menu.noNextQueue = true
			menu.answer = menu.texts.removeNumberOk
			menu.noNextQueue = true
			self.commandAnswer(id)

			menu.path = 'garage'
			menu.dropCommand = true
			return self.parseText(id)

		default:
			menu.answer = menu.texts.removeNumberText()
			self.commandAnswer(id)
	}
}

module.exports = f
