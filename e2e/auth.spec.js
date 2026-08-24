import { test, expect } from '@playwright/test'
import { uniqueUser, register, login, logout } from './helpers.js'

test('To register a new account and reaches the dashboard', async ({ page }) => {
  const user = uniqueUser()
  await register(page, user)
  await expect(page.getByText('My Flashcard Decks')).toBeVisible()
  await expect(page.getByTestId('username')).toHaveText(user.username)
})

test('To show an error on invalid login credentials', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('you@example.com').fill('nobody@example.com')
  await page.getByPlaceholder('Enter your password').fill('wrong-password')
  await page.getByRole('button', { name: 'Sign In' }).click()

  await expect(page.locator('.alert-danger')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('To log in and back out with a freshly registered account', async ({ page }) => {
  const user = uniqueUser()
  await register(page, user)
  await logout(page)
  await login(page, user.email, user.password)
  await expect(page.getByText('My Flashcard Decks')).toBeVisible()
})
