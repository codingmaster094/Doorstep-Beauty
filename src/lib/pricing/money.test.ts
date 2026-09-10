import { computeFinalAmount } from './money'
import { describe, expect, it } from 'vitest'

describe('computeFinalAmount', () => {
  it('adds service, visit, addons and subtracts discount', () => {
    expect(
      computeFinalAmount({
        serviceAmount: 800,
        homeVisitCharge: 150,
        addonAmount: 200,
        discount: 100,
      }),
    ).toBe(1050)
  })

  it('never goes below zero', () => {
    expect(
      computeFinalAmount({
        serviceAmount: 100,
        homeVisitCharge: 0,
        addonAmount: 0,
        discount: 500,
      }),
    ).toBe(0)
  })
})
