import { Locator, Page } from '@playwright/test'

export class ShoppingCartPage {
  constructor(private page: Page) {}

  async getCartItem(item: string): Promise<Locator> {
    return this.page.locator(`div.cart-item:has-text("${item}")`)
  }

  async removeItem(item: string) {
    const itemElement = await this.getCartItem(item)
    await itemElement.locator('button.remove-item').click()
  }

  async setQuantity(item: string, quantity: number) {
    const itemElement = await this.getCartItem(item)
    await itemElement.locator('input.quantity').fill(quantity.toString())
  }

  async getCountdown(): Promise<string | null> {
    const itemElement = this.page.locator('div#timer')
    return itemElement.textContent() || null
  }

  async getDisplayedTotal(): Promise<number> {
    const itemText = await this.page.locator('span#totalAmount').textContent()
    const total = this.parseCurrency(itemText || '0')
    return Math.round(total * 100) / 100
  }

  async getCalculatedTotal(): Promise<number> {
    const allItems = await this.page.locator('.cart-item').all()
    let total = 0

    for (const item of allItems) {
      // The price is something like $19.99, so we need to remove the $ and commas
      const priceText = await item.locator('div.price').textContent()
      const price = this.parseCurrency(priceText || '0')

      const quantityText = await item.locator('input.quantity').inputValue()
      const quantity = parseInt(quantityText || '0')

      total += price * quantity
    }

    return Math.round(total * 100) / 100
  }

  async checkoutButton(): Promise<Locator> {
    return this.page.locator('button#checkoutBtn')
  }

  async limitedAvailabilityIcon(): Promise<Locator> {
    return this.page.locator('span.icon-warning')
  }

  async confirmItemDeletion(shouldDelete: boolean) {
    const modal = this.page.locator('div.modal.active')

    if (shouldDelete) {
      await modal.locator('button.confirm-remove').click()
      return
    }

    await modal.locator('button.cancel-remove').click()
  }

  parseCurrency(amount: string): number {
    return parseFloat(amount.replace('$', '').replace(',', ''))
  }
}
