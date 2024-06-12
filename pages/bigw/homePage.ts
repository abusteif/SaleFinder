import { expect, type Locator, type Page } from '@playwright/test';
import { bigw } from '../../configs/generic'

export default class BigWLoginPage {
    readonly page: Page;
    readonly searchField: Locator;
    readonly searchButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.searchField = this.page.getByTestId("header-search-input")
        this.searchButton = this.page.getByTestId('header-search-modal').getByRole('button', { name: 'search' })
      }
    
    goto = async () => {
        await this.page.goto(bigw.website)
    }

    searchForText = async (searchText:string) => {
        await this.searchField.click()
        await this.searchField.nth(1).fill(searchText)
        await this.searchButton.click()
    }

    // enterPassword = async (password:string) => {

    //     await this.passwordField.fill(password)
    // }

    // goto = async () => {
    //     await this.page.goto("https://login.test.leap365.com.au/oauth/authenticate")
    // }

    // login = async (username: string, password: string) => {

    //     this.enterPassword(username)
    //     this.enterPassword(password)
    // }

}