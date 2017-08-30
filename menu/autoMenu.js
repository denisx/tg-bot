function f (id) {
	let self = this
	let menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on autoMenu', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'autoMenu'
	if (menu.whoseAuto == 'my' && !menu.hasMobileAuth) {
		menu.requestContact = true
	}
	switch (menu.command) {

		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			delete menu.requestContact
			return self.parseText(id)

		case 'back':
			menu.path = 'inputNumber'
			menu.dropUserText = true
			delete menu.requestContact
			return self.parseText(id)

		case 'textToAuto':
			delete menu.requestContact
			menu.path = 'textToAuto'
			// menu.dropCommand = true
			return self.parseText(id)

		case 'mobileToAuto':
			menu.path = 'mobileToAuto'
			menu.dropCommand = true
			return self.parseText(id)

		case 'searchByNumber':
			delete menu.requestContact
			menu.path = 'searchByNumber'
			menu.dropCommand = true
			return self.parseText(id)

		default:

			menu.answer += menu.texts.numberGood + ' ' + menu.numberObj.number +
				menu.texts.vars.newLine + menu.texts.autoMenuInfo()
	}
	self.commandAnswer(id)
}

module.exports = f
