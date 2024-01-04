const inquirer = require('inquirer');
const cheerio = require('cheerio');

async function fetchData(url) {
  const response = await fetch(url)
  const body = await response.text()
  return body
}

function extractText(data, selector) {
  const $ = cheerio.load(data)

  return $(selector).text()
}

async function scrapeAndPrintText() {
  const questions = [
    {
      type: 'input',
      name: 'url',
      message: "What's the url?",
    },
    {
      type: 'input',
      name: 'selector',
      message: "What's the selector?",
    },
  ]

  const { url, selector } = await inquirer.prompt(questions)

  const html = await fetchData(url)
  
  const text = extractText(html, selector)

  console.log(text)
}

scrapeAndPrintText()