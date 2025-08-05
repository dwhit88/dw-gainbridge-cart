import { test, expect } from '@playwright/test'
import { ShoppingCartPage } from './page-objects/home-page'

export const baseUrl = 'https://gb-saa-test.vercel.app'

const cartItems = {
  shirt: 'Kid’s T-shirt – Size M',
  headphones: 'Bluetooth Headphones',
  mug: 'Travel Mug',
}

test.describe.only('Shopping Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl)
  })

  test('should cancel item deletion', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.removeItem(cartItems.shirt)
    await shoppingCartPage.confirmItemDeletion(false)
    expect(await shoppingCartPage.getCartItem(cartItems.shirt)).toBeVisible()
    expect(await shoppingCartPage.getCartItem(cartItems.headphones)).toBeVisible()
    expect(await shoppingCartPage.getCartItem(cartItems.mug)).toBeVisible()
    expect(await shoppingCartPage.getDisplayedTotal()).toBe(
      await shoppingCartPage.getCalculatedTotal()
    )
  })

  test('should remove one item from cart', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.removeItem(cartItems.shirt)
    await shoppingCartPage.confirmItemDeletion(true)

    expect(await shoppingCartPage.getCartItem(cartItems.shirt)).not.toBeVisible()
    expect(
      await shoppingCartPage.getCartItem(cartItems.headphones)
    ).toBeDefined()
    expect(await shoppingCartPage.getCartItem(cartItems.mug)).toBeDefined()

    expect(await shoppingCartPage.getDisplayedTotal()).toBe(
      await shoppingCartPage.getCalculatedTotal()
    )
  })

  test('should remove all items from cart', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.removeItem(cartItems.shirt)
    await shoppingCartPage.confirmItemDeletion(true)
    await shoppingCartPage.removeItem(cartItems.headphones)
    await shoppingCartPage.confirmItemDeletion(true)
    await shoppingCartPage.removeItem(cartItems.mug)
    await shoppingCartPage.confirmItemDeletion(true)

    expect(await shoppingCartPage.getCartItem(cartItems.shirt)).not.toBeVisible()
    expect(await shoppingCartPage.getCartItem(cartItems.headphones)).not.toBeVisible()
    expect(await shoppingCartPage.getCartItem(cartItems.mug)).not.toBeVisible()

    expect(await shoppingCartPage.getDisplayedTotal()).toBe(0)
  })

  test('should remove out-of-stock item from cart', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.removeItem(cartItems.mug)
    await shoppingCartPage.confirmItemDeletion(true)

    expect(await shoppingCartPage.getCartItem(cartItems.mug)).not.toBeVisible()
    expect(
      await shoppingCartPage.getCartItem(cartItems.headphones)
    ).toBeDefined()
    expect(await shoppingCartPage.getCartItem(cartItems.shirt)).toBeDefined()

    expect(await shoppingCartPage.checkoutButton()).not.toBeDisabled()
    expect(await shoppingCartPage.getDisplayedTotal()).toBe(
      await shoppingCartPage.getCalculatedTotal()
    )
  })

  test('should increase quantity of item in cart', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.setQuantity(cartItems.headphones, 8)
    expect(await shoppingCartPage.getDisplayedTotal()).toBe(
      await shoppingCartPage.getCalculatedTotal()
    )
  })

  test('should decrease quantity of item in cart', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.setQuantity(cartItems.headphones, 0)
    expect(await shoppingCartPage.getDisplayedTotal()).toBe(
      await shoppingCartPage.getCalculatedTotal()
    )
  })

  test('should disable checkout button when all quantities are 0', async ({
    page,
  }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await shoppingCartPage.setQuantity(cartItems.shirt, 0)
    await shoppingCartPage.setQuantity(cartItems.headphones, 0)
    expect(await shoppingCartPage.checkoutButton()).toBeDisabled()

    await shoppingCartPage.removeItem(cartItems.mug)
    await shoppingCartPage.confirmItemDeletion(true)

    expect(await shoppingCartPage.checkoutButton()).toBeDisabled()
    expect(await shoppingCartPage.getDisplayedTotal()).toBe(
      await shoppingCartPage.getCalculatedTotal()
    )
  })

  test('should display limited availability text on hover', async ({
    page,
  }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await (await shoppingCartPage.limitedAvailabilityIcon()).hover()
    expect(page.getByTitle('Limited Availability')).toBeVisible()
  })

  test('should display out-of-stock text on hover', async ({ page }) => {
    const shoppingCartPage = new ShoppingCartPage(page)
    await (await shoppingCartPage.checkoutButton()).hover()
    expect(page.getByTitle('Please remove out-of-stock items to proceed')).toBeVisible()
  })
})
