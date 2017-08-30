function f (id) {
	var self = this
	var menu = self.menu[id]
	console.log()
	console.log(self.services.getDT(), id, 'on textToAuto', menu.userText)
	menu.answer = ''
	menu.keyboardPath = 'back'
	//todo
	if (/258053044/.test(id)) {
		menu.answer = '--- === YOU ARE BANNED *<;] --- === \n'
		self.commandAnswer(id)
		return
	}
	switch (menu.command) {
		case 'textToAuto':
			menu.answer += menu.texts.waitForTextToAuto(menu.numberObj.number) +
				menu.texts.vars.newLine + menu.texts.exampleMsg()
			break

		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)
		case 'back':
			menu.path = 'autoMenu'
			menu.dropCommand = true
			return self.parseText(id)

		default:

			// Эвакуация 1
			// Битая 2
			// Нерабочий свет ламп 3
			// Тюнинг 4
			// Особый раскрас 5
			// Поведение/парковка/хам / 6 хам | 7 молодец

			// Пробег?
			// 	Год выпуска?
			// цвет/модель/тип


			var msgPre = ''
			// var fromEvacuate = false
			if (menu.userText == 'evacuateAuto') {
				msgPre = menu.texts.evacuateAction
				// fromEvacuate = true
			} else {
				msgPre = menu.userText
			}
			return self.services.saveMsg({
				id: menu.msg.from.id,
				menu: menu,
				text: msgPre,
				numberId: menu.numberObj.numberId
			})
				.then((rows) => {
					menu.answer = menu.texts.saveOneMore
					menu.noNextQueue = true
					self.commandAnswer(id)

					menu.answer = menu.texts.userForNumber + ': ' + rows.length
					self.commandAnswer(id)
					// if (rows.length) {
					// } else {
					// 	menu.answer = menu.texts.saveOneMore
					// 	self.commandAnswer(id)
					// }

					rows.forEach((row) => {
						self.sendClearMessage({
							chatId: row.userId,
							fromId: row.userId,
							userText: menu.texts.youHaveMsg + ' ' + menu.numberObj.number + menu.texts.vars.newLine +
							msgPre
						})
					})
				})
				.catch((err) => {
					console.error(self.services.getDT(), id, 'saveMsg', 'err', err)
					menu.path = 'autoMenu'
					menu.dropCommand = true
					return self.parseText(id)
				})
	}
	self.commandAnswer(id)
}

module.exports = f
