#!/bin/sh

cat nicRu.js nicCore.js nicPane.js nicAdvancedButton.js nicButtonTips.js \
    nicFontSelect.js nicColors.js nicXHTML.js nicCodeButton.js nicTable.js nicFloatingPanel.js \
    nicSanitize.js sanitize-html.js > nicEdit.js
yui-compressor nicEdit.js > nicEdit.min.js
