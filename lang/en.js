const v = {
	line: '\r\n'
}

const texts = {
	v,
	langList: {
		ru: 1,
		en: 1
	},
	// botMenu: {
	// 	start: [['site', 'likes']],
	// 	inner: [['home', 'likes']]
	// },
	// botMenuInline: {
	botMenu: {
		// start: [['newNumber', 'action'], ['messages'], ['garage']], // 'lang',
		// start: [['numbers']],
		start: [['newNumber', 'action'], ['messages'], ['garage', 'likes']], // 'lang',
		lang: [['ru', 'en'], ['back', 'home']],
		newNumber: [['notMyAuto', 'myAuto'], ['back', 'home']],
		inputNumber: [['back', 'home']],
		autoMenu: [['textToAuto'], ['mobileToAuto'], ['searchByNumber'], ['back', 'home']],
		back: [['back', 'home']],
		backSkip: [['skip'], ['back', 'home']],
		messages: [['msgToMe'/*, 'myMsg'*/], ['back', 'home']],
		msgToMe: [['msgToMe'/*, 'myMsg'*/], ['back', 'home']],
		myMsg: [['msgToMe'], ['back', 'home']],
		makePrivateAnswer: [['back', 'home']],
		garage: [['newNumber', 'settings'], ['back', 'home']],
		removeNumber: [['removeNumber'], ['back', 'home']],
		action: [['eva'], ['awesome'], ['back', 'home']],
		eva: [['seeEva'], ['findEva'], ['back', 'home']],
		seeEva: [['emptyEva'], ['waitForAuto'], ['shipAuto'], ['takeAway'], ['back', 'home']],
		agree: [['yes', 'no'], ['back', 'home']],
		numbers: [['otherNumbers', 'myNumbers'], ['back', 'home']],
		myNumbers: [['back', 'home']]
		// 'start': [['addNumber'], ['myNumbers'], ['msgToMe'], ['info', 'likes']],
		// 'addNumber': [['back']],
	},
	ru: {
		months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь',
			'Октябрь', 'Ноябрь', 'Декабрь'],
		months2: ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября',
			'Октября', 'Ноября', 'Декабря'],
		numbersBase: {
			ru: {
				'auto-1993': 'Авто, белый',
				taxi: 'Такси, желтый',
				trailer: 'Трайлер, белый',
				'moto/tractor': 'Мото / трактор, белый',
				'auto-police-1': 'Полиция, синий',
				'auto-police-2': 'Полиция, синий',
				'moto-police': 'Полиция мото, синий'
			}
		},
		acceptCommands: {
			site: 'Сайт',
			numbers: 'Авто',
			otherNumbers: 'Чужие авто',
			myNumbers: 'Мои авто',
			ru: 'Русский',
			en: 'English',
			newNumber: 'Новый номер',
			messages: 'Сообщения',
			garage: 'Гараж',
			lang: 'Ру / En',
			back: 'Обратно',
			info: 'Инфо',

			notMyAuto: 'Чужое авто',
			myAuto: 'Моё авто \uD83C\uDFCE',
			menu: 'В начало',
			mobileToAuto: 'Добавить мобильный к номеру',
			// addNumber: 'Добавить номер машины',
			evacuateAuto: 'Эвакуируют!',
			// myAuto: 'Это номер моей машины, получать сообщения',
			textToAuto: 'Сообщение для авто',
			home: 'Домой \uD83C\uDFE0',
			msgToMe: 'Входящие',
			myMsg: 'Исходящие',
			toBegin: 'В начало',
			nextPage: 'Следующая',
			prevPage: 'Предыдущая',
			private: 'Личная',
			makePrivateAnswer: 'Ответить лично',
			removeNumber: 'Удалить номер',

			eva: 'Эвакуатор',
			seeEva: 'Вижу эвакуатор',
			findEva: 'Поиск на карте',
			emptyEva: '1. Пустой',
			waitForAuto: '2. В ожидании',
			shipAuto: '3. Грузит',
			takeAway: '4. Увозит',
			skip: 'Пропустить',
			awesome: 'Что-то необычное',
			action: 'Событие!',
			settings: 'Настройки',
			yes: 'Да',
			no: 'Нет',
			searchByNumber: 'Показать мобильный владельца'
		},
		start: 'Привет!',
		searchByNumberOwner: 'Владелец авто',
		searchByNumberSubscribe: 'Скоро заработает подписка, и мы пришлём вам мобильный, как только он появиться в базе',
		searchEmpty: 'Поиск ничего не нашел.',
		searchLater: '',
		cannotSearchByNumber: () => {
			return 'Для поиска авто вам нужно:' + v.line +
				'1. Добавить своё авто в /garage ' + texts.ru.acceptCommands.garage + v.line +
				'2. Дать согласие в /settings ' + texts.ru.acceptCommands.settings
		},
		settingsInfo: function (shareMobile) {
			return 'Разрешить использовать мой мобильный для поиска по номерам моих авто, включая автоматическую ' +
				'обработку данных и т.п.:' + v.line +
				(shareMobile === 1 ? '✓' : '') + ' /yes ' + texts.ru.acceptCommands.yes + v.line +
				(shareMobile !== 1 ? '✓' : '') + ' /no ' + texts.ru.acceptCommands.no + v.line
		},
		ok: 'OK!',
		infoAboutAuto: 'Информация по авто',
		infoAboutAutoError: 'Ошибка',
		infoAboutAutoErrorLowCredit: 'Недостаточно монет',
		getGeoDone: 'OK, гео-точка сохранена',
		actionText: function () {
			return 'Что происходит?' + v.line +
				'/eva ' + texts.ru.acceptCommands.eva + v.line +
				'/awesome ' + texts.ru.acceptCommands.awesome + v.line
		},
		waitForPhotoEva: 'На фото обязательно должено быть эвакуатор',
		waitForPhotoAwesome: 'На фото обязательно должно быть авто (любое ТС) или событие на дороге',
		waitForPhoto: 'Пришлите фотографию',
		savePhotoDone: 'Фото сохранил',
		waitPhotoMore: function () {
			return 'Добавьте ещё фото, или добавьте /newNumber ' + texts.ru.acceptCommands.newNumber
		},
		acceptGroupMenu: {
			add: '+ свой номер',
			check: 'Проверить номер'
		},
		v,

		// changeLangDone: 'Вы сменили язык',
		langInfo: 'Выберите нужный язык',
		newNumberInfo: function () {
			return 'Чья это машина?' + v.line +
				'/notMyAuto ' + texts.ru.acceptCommands.notMyAuto + v.line +
				'/myAuto ' + texts.ru.acceptCommands.myAuto + v.line
		},

		inputNumber: 'Ввод номера автомобиля, в формате x000xx777 (или номер мотоцикла, прицепа итп), ' +
		'любыми буквами (ру/en)' + v.line + 'Пишите номер авто:',
		waitForGeo: 'Пришлите свою гео-позицию',
		waitForGeoButtonText: 'Прислать свою гео-позицию \uD83D\uDEA9 \uD83D\uDCE1',
		waitForContact: 'Ожидаем ваш мобильный (нажмите кнопку ниже)',
		waitForContactButtonText: 'Передать свой мобильный',
		botError: 'Ошибка :( Это моя вина! Попробуем повторить позже...',
		info: function () {
			return 'Поиск машины по номеру, уведомление про эвакуацию, авто-чат.' + v.line +
				'Выберите нужное меню:' + v.line +
				'/newNumber ' + texts.ru.acceptCommands.newNumber + v.line
		},
		numberGood: 'OK! Номер',
		// numberNo: 'Не правильно ввели номер',
		numberCommandErr: 'Вы ввели неправильный номер',
		autoMenuInfo: function () {
			return 'Что дальше:' + v.line +
				'/textToAuto ' + texts.ru.acceptCommands.textToAuto + v.line +
				'/mobileToAuto ' + texts.ru.acceptCommands.mobileToAuto + v.line +
				'/searchByNumber ' + texts.ru.acceptCommands.searchByNumber

			// '/evacuateAuto Эвакуируют!' + v.line +
			// '/myAuto Это номер моего авто, получать сообщения' + v.line +
			// '/mobileToAuto Добавить мобильный к номеру' + v.line +
		},
		waitForTextToAuto: function (number) {
			return 'Сообщение владельцам номера ' + number + ' (это анонимно для вас)' +
				v.line + 'Пишите сообщение:'
		},
		saveOneMore: 'Отправил. Пиши ещё!',
		// save: 'Отправил',
		// yourNumbers: 'Ваши номера',
		// number: 'Номер',
		// zeroMsg: 'Пока вам никто не написал. Расскажите своим знакомым про @AntiParkon_Bot',
		// zeroNumber: 'Пока у вас нет номеров, добавьте их. Возможно, кто-то вам уже написал',
		// infoText: 'Бот @AntiParkon_Bot' + v.line +
		// 	'Запишите номер своего авто, и ждите сообщений, или сами кому-то пишите :)' + v.line +
		// 	'Вступайте в группу @AntiParkonGroup - помощь, обсуждение, чат' + v.line +
		// 	'Заходите на сайт http://autonum.me',
		likesInfo: 'Если я вам понравился, проголосуйте за меня:' + v.line +
		'1. Перейдите в бот <a href="https://telegram.me/storebot?start=AntiParkon_Bot">@StoreBot</a>' + v.line +
		'2. Нажмите там Start' + v.line +
		'3. Поставьте оценку' + v.line +
		'Спасибо! \u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F',
		youHaveMsg: 'Вам сообщение для номера',
		youHavePrivateMsg: 'Вам личное сообщение',
		// himselfText: v.line + '( Вы отправили сообщение самому себе. )',
		// evacuateCction: 'Ваше авто эвакуируют!',
		//
		// groupDefaultText: '/add Добавить номер своего авто' + v.line +
		// 	'/check Проверить наличие в базе' + v.line +
		// 	'/like Быстрый like и +1 владельцу авто :)' + v.line +
		// 	'/evacuateAuto Авто эвакуируют' + v.line +
		// 	'/msg Сообщение владельцу' + v.line +
		// 	'/bad Владелец авто - редиска' + v.line,
		//
		mobileToAutoText: 'Добавить мобильный к номеру',
		writeMobileDo: 'Пишите мобильный:',
		mobileSaveText: 'Сохранил мобильный. Его никто нигде не увидит, если только я напишу вам смс.',
		exampleMsg: function () {
			const msg = [
				'Привет! У тебя крутая тачка!',
				'Привет! Да ты байкер!',
				'Привет! Да ты гонщик!',
				'Привет! Вот это молодец!',
				'Привет! Диски нормас!',
				'Привет! Бампер зачет!',
				'Привет! Прокаченая, видно!',
				'Привет! Качаешь на всю дорогу!',
				'Привет! Шикарно водишь!',
				'Привет! Мне бы так, круто!'
			]
			const n = msg.length
			let select = Math.round(Math.random() * n)
			if (select < 0 || select >= n) {
				select = 0
			}
			return 'Например: ' + msg[select]
		},
		forNumber: 'Для номера',
		noMsg: 'Пока вам никто не написал.',
		messages: 'Сообщений',
		makePrivateAnswer: function () {
			return '/makePrivateAnswer ' + texts.ru.acceptCommands.makePrivateAnswer
		},
		page: 'Страница',
		nextPage:  function () {
			return '/nextPage ' + texts.ru.acceptCommands.nextPage
		},
		prevPage:  function () {
			return '/prevPage ' + texts.ru.acceptCommands.prevPage
		},
		makePrivateAnswerText: 'Напишите сообщение напрямую пользователю, это анонимно для вам. ' +
		'Никто, кроме адресата, это не прочитает.',
		authErr: 'Ошибка доступа.',
		addMoreNumbers: function () {
			return 'Добавьте больше своих номеров.' + v.line +
				'/newNumber ' + texts.ru.acceptCommands.newNumber
		},
		myAutoList: 'Мои номера',
		notMyAutoList: 'Чужие номера',
		removeNumberText: function () {
			return 'Удалить ваш номер?' + v.line +
				'/removeNumber ' + texts.ru.acceptCommands.removeNumber
		},
		removeNumberOk: 'Ваш номер удален из списка.',
		autoSign: 'знак',
		privateMsgs: 'Личные сообщения',
		readUnread: 'новых (всего)',
		goToStart: 'Главный экран',
		inAnswer: 'В ответ на ваше сообщение',
		youGetAnswer: 'вы получили ответ',
		userForNumber: 'Владельцев номера в базе',
		emptyEvaText: 'Едет пустой. Пока не стоит волноваться, просто внимание.',
		waitForAutoText: 'Готовиться к эвакуации, стоит в очереди на погрузку. Самый удобный момент предупредить владельцев.',
		shipAutoText: 'Грузит авто. Опасность. Последняя возможность предупредить владельцев.',
		takeAwayText: 'Едет с авто. Опоздали, но владельца стоит оповестить, ему нужно подготовиться.',
		evaText: function () {
			return 'Что происходит?' + v.line +
				'/seeEva ' + texts.ru.acceptCommands.seeEva + v.line +
				'/findEva ' + texts.ru.acceptCommands.findEva + v.line
		},
		seeEvaText: function () {
			return 'Вы видите эвакуатор! Без паники, внимательно выберите пункт' + v.line +
				'/emptyEva ' + texts.ru.emptyEvaText + v.line +
				'/waitForAuto ' + texts.ru.waitForAutoText + v.line +
				'/shipAuto ' + texts.ru.shipAutoText + v.line +
				'/takeAway ' + texts.ru.takeAwayText + v.line
		}
	},





	en: {
		acceptCommands: {
			ru: 'Русский',
			en: 'English',
			newNumber: 'Add number',
			messages: 'Messages',
			garage: 'garage',
			lang: 'Ру / En',
			back: 'Back',
			info: 'Info',

		},
		v,

		// changeLangDone: 'Change lang done',
		chooseLang: 'Choose lang',
		info: 'Search auto by number, attention about evacuation, auto-chat' + v.line,
		mobileToAutoDo: 'Пишите мобильный:',
		textToAutoDo: 'Пишите сообщение:'
	}
}


class Lang {
	constructor (opts) {
		// const v = {
		// 	line: '\r\n',
		// 	botName: opts.botName
		// }

		return {
			russian: 'Русский',
			english: 'English',
			// portugal: 'Португальский',
			// chinese: 'Китайский',

			hi: 'Hello!',
			start: 'Type car\'s number:',
			groupInfo: 'Please, enter / Пожалуйста, перейдите в${line}@${botName}',

			chooseLang: 'Выберите язык${line}Choose language',
			settings: 'Settings',
			saveLangOK: 'Settings saved',
			home: 'Home',

			likes: '\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F',
			noLang: 'Sorry, no translation here yet. Soon...'
		}
	}
}

module.exports = (opts) => {
	// if (!opts) {
	// 	return errLog('ru.js', 'exports', 'no opts')
	// }
	return new Lang(opts)
}
