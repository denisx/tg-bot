function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on inputNumber', menu.userText)
	menu.keyboardPath = 'inputNumber'
	menu.answer = ''
	switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'back':
			menu.path = 'newNumber'
			menu.dropUserText = true
			menu.dropCommand = true
			return self.parseText(id)
		default:
			menu.answer += ((menu.whoseAuto == 'my') ?
					menu.texts.acceptCommands.myAuto : menu.texts.acceptCommands.notMyAuto) +
				texts.vars.newLine

			var numberObj = self.services.getNumber({
				id: menu.msg.from.id,
				menu: menu,
				number: menu.userText//((menu.msg.contact) ? menu.msg.contact.phone_number : menu.userText),
				//verify: (menu.msg.contact)
			})
			if (numberObj) {
				menu.numberObj = numberObj
				menu.answer += menu.texts.numberGood + ' ' +
					menu.texts.numbersBase[menu.numberObj.lang][menu.numberObj.key] + ' ' +
					menu.texts.autoSign + texts.vars.newLine + menu.numberObj.number

				menu.noNextQueue = true
				self.commandAnswer(id)

				return self.services.saveNumber({
					id: menu.msg.from.id,
					menu: menu,
					number: menu.numberObj.number
				})
					.then((insertId) => {
						menu.numberObj.numberId = insertId

						self.services.saveUserToNumber({
							id: menu.msg.from.id,
							numberId: menu.numberObj.numberId,
							isMy: (menu.whoseAuto == 'my') ? 1 : 0
						})
							.then(() => {
								menu.path = 'autoMenu'
								menu.dropCommand = true
								return self.parseText(id)
							})
							.catch((err) => {
								console.error(self.services.getDT(), id, 'saveUserToNumber', 'err', err)
								menu.path = 'autoMenu'
								return self.parseText(id)
							})
					})
					.catch((err) => {
						console.error(self.services.getDT(), id, 'saveNumber', 'err', err)
						menu.path = 'autoMenu'
						return self.parseText(id)
					})

			} else {
				menu.answer += menu.texts.inputNumber
			}
	}
	self.commandAnswer(id)
}

module.exports = f
