import { test, expect } from '@playwright/test'
import { login } from './helpers.js'

test.beforeEach(async ({ page }) => {
  await login(page, "user1@smu.edu.sg", "p@ssw0rd")
})

async function createDeck(page, { title, cards }) {
  await page.getByRole('link', { name: '+ Create New Deck' }).first().click()
  await page.getByPlaceholder('e.g. JavaScript ES6 Features').fill(title)
  await page.getByRole('button', { name: /next: add cards/i }).click()

  for (let i = 0; i < cards.length; i++) {
    if (i > 0) await page.getByRole('button', { name: '+ Add Another Card' }).click()
    const editors = page.locator('.card.mb-3')
    await editors.nth(i).getByPlaceholder('Enter a question.').fill(cards[i].front)
    await editors.nth(i).getByPlaceholder('Enter the answer to the question above.').fill(cards[i].back)
  }

  await page.getByRole('button', { name: /save deck/i }).click()
  await expect(page).toHaveURL(/\/user$/)
}

test('To create a deck with cards and shows it on the dashboard', async ({ page }) => {
  const title = `E2E JS Deck ${Date.now()}`
  await createDeck(page, {
    title,
    cards: [
      { front: 'What is let?', back: 'A block-scoped keyword for declaring variables' },
      { front: 'What does === check?', back: 'Both value and type' },
    ],
  })

  const deckCard = page.locator('.card', { hasText: title })
  await expect(deckCard).toBeVisible()
  await expect(deckCard.getByText('2 cards')).toBeVisible()
})

test('To delete a deck from the dashboard', async ({ page }) => {
  const title = `E2E Delete Deck Test ${Date.now()}`
  await createDeck(page, { title, cards: [{ front: 'Q', back: 'A' }] })

  const deckCard = page.locator('.card', { hasText: title })
  await expect(deckCard).toBeVisible()

  await deckCard.getByRole('button', { name: 'Delete' }).click()
  await page.locator('.modal-dialog').getByRole('button', { name: 'Delete' }).click()

  await expect(deckCard).not.toBeVisible()
})
