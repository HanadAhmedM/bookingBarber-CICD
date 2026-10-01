import { test, expect } from '@playwright/test'

test('user can complete booking flow', async ({ page }) => {
  await page.goto('/')

  // Öppna bokning
  await page.getByRole('button', {
    name: 'Boka tid',
    exact: true,
  }).first().click()

  // Steg 1 – välj behandling
  await expect(
    page.getByRole('heading', {
      name: 'Välj behandling',
      exact: true,
    })
  ).toBeVisible()

  // ✅ LÖSNING 1: ingen exact:true – substring-matchning
await page.getByRole('button', { name: /^Haircut\b(?!\s*&)/ }).click()

  // Gå vidare till steg 2
  await page.getByRole('button', { name: /Fortsätt/ }).click()

  // Steg 2 – välj barberare
  await expect(
    page.getByRole('heading', {
      name: 'Välj barberare',
      exact: true,
    })
  ).toBeVisible()

  // ✅ LÖSNING 1: ingen exact:true här heller
  await page.getByRole('button', { name: 'Ahmed' }).click()

  // Gå vidare till steg 3
  await page.getByRole('button', { name: /Fortsätt/ }).click()

  // Steg 3 – välj datum och tid
  await expect(
    page.getByRole('heading', {
      name: 'Välj datum och tid',
      exact: true,
    })
  ).toBeVisible()

  const today = new Date()
  const dateString =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`

  await page.getByTestId(`day-${dateString}`).click()
  await page.getByTestId(`time-${dateString}-16:00`).click()

  // Gå vidare till steg 4
  await page.getByRole('button', { name: /Fortsätt/ }).click()

  // Steg 4 – fyll i uppgifter och bekräfta
  await expect(
    page.getByRole('heading', {
      name: 'Bekräfta bokning',
      exact: true,
    })
  ).toBeVisible()

  await page.getByPlaceholder('Ditt namn').fill('Test Testsson')
  await page.getByPlaceholder('Din e-post').fill('test1@example.com')

  await page.getByRole('button', {
    name: 'Bekräfta bokning',
    exact: true,
  }).click()

  // Bekräftelsesida
  await expect(
    page.getByRole('heading', {
      name: 'Bokningen är bekräftad',
      exact: true,
    })
  ).toBeVisible()
})