class Menu {
	constructor (opts) {
		const id = opts.id
		const app = opts.app
		const session = app.session[id]

		const lang = session.set.lang
		const state = session.set.state
		const ctx = session.ctx

		app.send(id, {
			ctx,
			type: 'sendMessage',
			data: texts.getFrameText(lang, state)
		})

		const menu = self.menu[id]
		console.log()
		console.log(self.services.getDT(), id, 'on garage', menu.userText)
		menu.answer = ''

		if (menu.msg.contact) {
			menu.answer = menu.texts.ok
			menu.noNextQueue = true
			self.commandAnswer(id)

			menu.path = 'settings'
			menu.dropCommand = true
			return self.parseText(id)
		}

		if (menu.hasMobileAuth) {
			menu.keyboardPath = 'agree'
		} else {
			menu.keyboardPath = 'back'
		}
		switch (menu.command) {
		case 'home':
			menu.path = 'start'
			menu.dropCommand = true
			return self.parseText(id)

			case 'back':
				menu.path = 'garage'
				menu.dropCommand = true
					return self.parseText(id)

				default:
					if (!menu.hasMobileAuth) {
						menu.requestContact = true
						menu.answer = menu.texts.waitForContact
						self.commandAnswer(id)
						return
					}

					if (['yes', 'no'].indexOf(menu.command) > -1) {
						let share = (menu.command == 'yes') ? 1 : 0
						return self.services.updateMobileShare({
							canShare: share,
							menu: menu
						})
							.then(() => {
								menu.answer = menu.texts.ok
								menu.noNextQueue = true
								self.commandAnswer(id)

								menu.path = 'garage'
								menu.dropCommand = true
								return self.parseText(id)
							})
							.catch((err) => {
								console.error(self.services.getDT(), 'updateMobileShare', 'err', err)
							})
					} else {
						return self.services.getMobileShare({
							menu: menu
						})
							.then((row) => {
								menu.answer = menu.texts.settingsInfo(row.shareMobile)
								self.commandAnswer(id)
							})
							.catch((err) => {
								console.error(self.services.getDT(), 'getMobileShare', 'err', err)
							})
					}
			}
		}
	}

module.exports = (opts) => {
	return new Menu(opts)
}
