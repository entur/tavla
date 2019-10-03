const fs = require('fs');

const font_folder = "node_modules/@entur/fonts";
const font_index_file = `${font_folder}/index.css`;

if (!fs.existsSync(font_index_file)) {
	fs.mkdirSync(font_folder, { recursive: true });
	fs.closeSync(fs.openSync(font_index_file, 'w'));
}
