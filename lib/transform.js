const cheerio = require('cheerio');

function convertCase(match) {
  if (!match) {
    return 'Fale';
  }

  if (match === match.toUpperCase()) {
    return 'FALE';
  }

  if (match === match.toLowerCase()) {
    return 'fale';
  }

  if (match[0] === match[0].toUpperCase()) {
    return 'Fale';
  }

  return 'Fale';
}

function transformHtml(html) {
  const $ = cheerio.load(html);
  const title = $('title').text();

  $('body *').contents().filter(function filterTextNodes() {
    return this.nodeType === 3;
  }).each(function replaceTextNode() {
    const text = $(this).text();
    const newText = text.replace(/Yale/gi, convertCase);
    if (text !== newText) {
      $(this).replaceWith(newText);
    }
  });

  const newTitle = title.replace(/Yale/gi, convertCase);
  if (title !== newTitle) {
    $('title').text(newTitle);
  }

  return {
    content: $.html(),
    title: newTitle || title
  };
}

module.exports = {
  transformHtml,
  convertCase
};
