function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on seeEva', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'seeEva'
	delete menu.requestLocation
	switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

		case 'back':
			menu.path = 'eva'
			menu.dropCommand = true
			return self.parseText(id)

		case 'emptyEva':
		case 'waitForAuto':
		case 'shipAuto':
		case 'takeAway':
			menu.eventStatus = {
				type: 'eva',
				subType: menu.command
			}
			menu.path = 'seeEvaInputGeo'
			menu.dropCommand = true
			return self.parseText(id)

		case 'findEva':
			menu.path = 'findEva'
			menu.dropCommand = true
			return self.parseText(id)

		default:
			menu.answer = menu.texts.seeEvaText()
			self.commandAnswer(id)
	}
}

module.exports = f
