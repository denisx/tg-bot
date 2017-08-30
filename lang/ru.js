class Lang {
	constructor() {
		return {
			ru: 'Русский',
			en: 'English',
			// portugal: 'Португальский',
			// chinese: 'Китайский',

			hi: 'Привет!',
			start: 'Напишите первый вопрос для своего опроса:',
			groupInfo: 'en: Please, enter${line}ru: Пожалуйста, перейдите в${line}@${botName}',

			chooseLang: 'Выберите язык${line}Choose language',
			settings: 'Настройки',
			saveLangOK: 'Настройки сохранены - ${lang}',
			home: 'В начало',

			likes: '\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F\u2B50\uFE0F',
			likesInfo: 'Понравился бот? ${emoji.robot_face} Ставьте пять!${line}' +
				'1. Перейдите в бот <a href="https://t.me/storebot?start=${botName}">@StoreBot</a>${line}' +
				'2. Нажмите там <i>Start</i>${line}' +
				'3. Поставьте оценку${line}' +
				'Спасибо! ${emoji.star}${emoji.star}${emoji.star}${emoji.star}${emoji.star}',
			// noLang: '...',
			// cantParseNumber: 'Не распознал номер. ${emoji.warning} Попробуйте ещё раз:',
			// error: 'Что-то пошло не так. ${emoji.space_invader} Попробуйте позже.',
			// noLPphoto: 'Нет фото. ${emoji.camera} Добавить на сайте ${LPsite}',
			// addNewLPphoto: 'Добавить новое фото ${emoji.camera} на сайте ${LPsite}',
			// carLPpage: 'на сайте',
			// antiparkonLinkText: 'Чат по номеру авто или узнать мобильный @AntiParkon_bot',
			//
			// leftNav: '${emoji.arrow_left}',
			// middleNav: '${text}',
			// rightNav: '${emoji.arrow_right}',
			// emptyNav: '\u200C',
			//
			// addToNote: 'Записать в блокнот ${emoji.ledger}',
			// addToGarage: 'Добавить в гараж ${emoji.house_with_garden}',
			// addedToNote: 'Записано в блокнот', // ${emoji.ledger} ${emoji.white_check_mark}
			// addedToGarage: 'Добавлено в гараж', // ${emoji.house_with_garden} ${emoji.white_check_mark}
			// addedToNoteAlready: 'Номер записан в блокнот',
			// addedToGarageAlready: 'Номер добавлен в гараж',

			dtFormat: '${day} ${month} ${year}',
			months: [
				'Январь',
				'Февраль',
				'Март',
				'Апрель',
				'Май',
				'Июнь',
				'Июль',
				'Август',
				'Сентябрь',
				'Октябрь',
				'Ноябрь',
				'Декабрь'],
			monthsTo: [
				'Января',
				'Февраля',
				'Марта',
				'Апреля',
				'Мая',
				'Июня',
				'Июля',
				'Августа',
				'Сентября',
				'Октября',
				'Ноября',
				'Декабря']
		}
	}
}

module.exports = (opts) => {
	return new Lang(opts)
}

// https://github.com/OneSignal/emoji-picker
