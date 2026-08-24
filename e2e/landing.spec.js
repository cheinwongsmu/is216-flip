import { test, expect } from '@playwright/test'

test('To show the hero content', async ({ page }) => {
  await page.goto('/landing')
  await expect(page.getByTestId('header-text')).toBeVisible()
  await expect(page.getByTestId('header-text')).toHaveText(/study smarter/i)
})

test('To navigate to the login page', async ({ page }) => {
  await page.goto('/landing')
  await page.getByTestId('login-link').click()
  await expect(page).toHaveURL(/\/login$/)
})

test('To redirect the root path to /landing', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/landing$/)
})
