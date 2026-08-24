import { expect } from '@playwright/test'

export function uniqueUser() {
  const id = Date.now()
  return {
    username: `e2e_${id}`,
    email: `e2e+${id}@smu.edu.sg`,
    password: 'p@ssw0rd',
  }
}

export async function register(page, user) {
  await page.goto('/register')
  await page.getByPlaceholder('Choose a username').fill(user.username)
  await page.getByPlaceholder('you@example.com').fill(user.email)
  await page.getByPlaceholder('At least 6 characters').fill(user.password)
  await page.getByPlaceholder('Re-enter your password').fill(user.password)
  await page.getByRole('button', { name: 'Create Account' }).click()
  await expect(page).toHaveURL(/\/user$/, { timeout: 10_000 })
}

export async function login(page, email, password) {
  await page.goto('/login')
  await page.getByPlaceholder('you@example.com').fill(email)
  await page.getByPlaceholder('Enter your password').fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL(/\/user$/, { timeout: 10_000 })
}

export async function logout(page) {
  await page.locator('a.dropdown-toggle').click()
  await page.getByRole('button', { name: /log out/i }).click()
  await expect(page).toHaveURL(/\/landing$/)
}
