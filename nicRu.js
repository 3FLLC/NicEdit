/* Russian localisation for NicEdit - Micro Inline WYSIWYG
 * Copyright 2012 Vitaliy Filippov
 *
 * This file is distributed under the terms of the MIT license
 */

var nicRu = {
	'Submit': 'Сохранить',

	'Click to Bold': 'Полужирный',
	'Click to Italic': 'Курсив',
	'Click to Underline': 'Подчёркнутый',
	'Left Align': 'По левому краю',
	'Center Align': 'По центру',
	'Right Align': 'По правому краю',
	'Justify Align': 'По ширине',
	'Insert Ordered List': 'Нумерованный список',
	'Insert Unordered List': 'Маркированный список',
	'Click to Subscript': 'Нижний индекс',
	'Click to Superscript': 'Верхний индекс',
	'Click to Strike Through': 'Зачёркнутый',
	'Remove Formatting': 'Убрать форматирование',
	'Indent Text': 'Увеличить отступ',
	'Remove Indent': 'Уменьшить отступ',
	'Horizontal Rule': 'Горизонтальная линия',

	'Font&nbsp;Size...': 'Размер...',
	'Font&nbsp;Family...': 'Шрифт...',
	'Font&nbsp;Format...': 'Формат...',
	'Select Font Size': 'Выберите размер шрифта',
	'Select Font Family': 'Выберите шрифт',
	'Select Font Format': 'Выберите формат абзаца',
	'Sans-Serif': 'Беззасечный',
	'Serif': 'С засечками',
	'Fantasy': 'Декоративный',
	'Monospace': 'Моноширинный',
	'Cursive': 'Рукописный',
	'Paragraph': 'Обычный',
	'Pre': 'Код',
	'Heading&nbsp;6': 'Заголовок&nbsp;6',
	'Heading&nbsp;5': 'Заголовок&nbsp;5',
	'Heading&nbsp;4': 'Заголовок&nbsp;4',
	'Heading&nbsp;3': 'Заголовок&nbsp;3',
	'Heading&nbsp;2': 'Заголовок&nbsp;2',
	'Heading&nbsp;1': 'Заголовок&nbsp;1',

	'Change Text Color': 'Цвет текста',
	'Change Background Color': 'Цвет фона',

	'Save this content': 'Сохранить',

	'Add Link': 'Вставить ссылку',
	'URL or Page': 'URL или страница',
	'Remove Link': 'Убрать ссылку',
	'Add/Edit Link': 'Ссылка',
	'Hint': 'Подсказка',
	'Open In': 'Открыть',
	'Current Window': 'В этом окне',
	'New Window': 'В новом окне',
	'You must enter a URL to Create a Link': 'Чтобы создать ссылку, введите её URL',

	'Add Image': 'Вставить картинку',
	'Add/Edit Image': 'Картинка',
	'Alt Text': 'Подсказка',
	'Align': 'Положение',
	'Inline': 'В тексте',
	'Left': 'Слева',
	'Right': 'Справа',
	'Insert an Image': 'Вставить картинку',
	'You must enter a Image URL to insert': 'Чтобы вставить картинку, введите её URL',

	'URL or Name': 'URL или имя',
	'Hyperlink': 'Ссылка',
	'Open in new window': 'Открывать в новом окне',
	'Max Size': 'Макс. размер',
	'To insert an image you must select uploaded file ID or enter the image URL!': 'Чтобы вставить картинку, либо выберите её из выпадающего списка (работают подсказки по названию), либо введите её прямой URL!',
	'Or upload': 'Или загрузить',
	'Select file': 'Выбрать файл',

	'Upload Image': 'Загрузить картинку',
	'Failed to upload image': 'Ошибка загрузки картинки',
	'Only image files can be uploaded': 'Так загружать можно только картинки',
	'Image uploads are not supported in this browser, use Chrome, Firefox, or Safari instead.': 'Чтобы загружать картинки, используйте современный браузер - Chrome, Firefox, или Safari.',

	'Edit HTML': 'Править HTML-код',

	'Add Table': 'Вставить таблицу',
	'Add/Edit Table': 'Таблица',
	'Columns': 'Колонки',
	'Rows': 'Строки',
	'Headers': 'Заголовок',
	'None': 'Нет',
	'Top': 'Сверху',
	'Top and Left': 'Сверху и слева'
};

function __(s) {
	return nicRu[s] || s;
};
