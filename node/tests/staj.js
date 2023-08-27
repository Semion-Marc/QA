const {By, WebDriver, until } = require("selenium-webdriver");
const {suite} = require("selenium-webdriver/testing");
const chrome = require('selenium-webdriver/chrome');
const assert = require("assert");

suite(function(env){
	describe("Зайти на сайт Авито", () => {
		const siteURL = "https://www.avito.ru/";
		before(async () => { 
			driver = await env.builder().forBrowser("chrome").setChromeOptions(new chrome.Options().addArguments('--ignore-certificate-errors')).build();
			await driver.get(siteURL);
		})
		it("Не должно происходить никаких перенаправлений", async () => {		
			URL = await driver.getCurrentUrl();
			assert(URL == siteURL);
		});
		it("Добавить товар в избранное с карточки товара, в избранном будет этот товар", async () => {		
			//Выбрать первый товар категории "Рекомендации для вас", запомнить его номер для сравнения
			thing = await driver.findElement(By.css('div[class="styles-list-M1e9B"] > div'));
			thingID = await thing.getAttribute('class');
			thingID = await thingID.substr(21, 15)
			thing = await driver.findElement(By.css('div[class="styles-list-M1e9B"] > div > div > header > a'));
			thingURL = await thing.getAttribute('href');
			await driver.get(thingURL); //Такой способ перехода, чтобы избежать открытия новой вкладки при клике на товар
			//Добавление в избранное
			addFavoriteButton = await driver.findElement(By.css('div[class="style-header-add-favorite-M7nA2"]'));
			await addFavoriteButton.click();
			favoriteButton = await driver.findElement(By.css('a[class="index-counter-UxPCj"]'));
			await favoriteButton.click();
			//Проверка количества товаров и сравнение их по коду
			num = await driver.findElement(By.css('span[class="category-content-count-SHk4K"]')).getAttribute('innerHTML');
			id = await driver.findElement(By.css('div[class="item-snippet-root-d2wFO"]')).getAttribute('data-marker');
			assert((num == 1)&&(id === thingID));
		});
		after(async () => {
			driver.close();
		});
	});
});