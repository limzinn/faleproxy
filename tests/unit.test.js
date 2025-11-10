const cheerio = require('cheerio');
const { transformHtml, convertCase } = require('../lib/transform');
const { sampleHtmlWithYale } = require('./test-utils');

describe('Yale to Fale replacement logic', () => {
  
  test('should replace Yale with Fale in text content', () => {
    const { content } = transformHtml(sampleHtmlWithYale);
    const $ = cheerio.load(content);
    
    // Check text replacements
    expect(content).toContain('Fale University Test Page');
    expect(content).toContain('Welcome to Fale University');
    expect(content).toContain('Fale University is a private Ivy League');
    expect(content).toContain('Fale was founded in 1701');
    
    // Check that URLs remain unchanged
    expect(content).toContain('https://www.yale.edu/about');
    expect(content).toContain('https://www.yale.edu/admissions');
    expect(content).toContain('https://www.yale.edu/images/logo.png');
    expect(content).toContain('mailto:info@yale.edu');
    
    // Check href attributes remain unchanged
    expect(content).toMatch(/href="https:\/\/www\.yale\.edu\/about"/);
    expect(content).toMatch(/href="https:\/\/www\.yale\.edu\/admissions"/);
    
    // Check that link text is replaced
    expect(content).toContain('>About Fale<');
    expect(content).toContain('>Fale Admissions<');
    
    // Check that alt attributes are not changed
    expect(content).toContain('alt="Yale Logo"');
  });

  test('should leave content unchanged when there are no Yale references', () => {
    const htmlWithoutYale = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <h1>Hello World</h1>
        <p>This is a test page about universities in general.</p>
      </body>
      </html>
    `;
    
    const { content } = transformHtml(htmlWithoutYale);
    const $ = cheerio.load(content);
    
    expect($.html()).toContain('<title>Test Page</title>');
    expect($.html()).toContain('<h1>Hello World</h1>');
    expect($.html()).toContain('<p>This is a test page about universities in general.</p>');
  });

  test('should handle case-insensitive replacements', () => {
    const mixedCaseHtml = `
      <p>YALE University, Yale College, and yale medical school are all part of the same institution.</p>
    `;
    
    const { content } = transformHtml(mixedCaseHtml);

    expect(content).toContain('FALE University, Fale College, and fale medical school');
  });

  test('convertCase preserves original casing patterns', () => {
    expect(convertCase('YALE')).toBe('FALE');
    expect(convertCase('Yale')).toBe('Fale');
    expect(convertCase('yale')).toBe('fale');
    expect(convertCase('yAle')).toBe('Fale');
  });
});
