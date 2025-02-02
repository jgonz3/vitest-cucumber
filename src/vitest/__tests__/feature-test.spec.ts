import { loadFeature } from '../load-feature'
import { describeFeature } from '../describe-feature'
import {
    expect, vi, test, beforeEach,
} from 'vitest'

const feature = await loadFeature(`src/vitest/__tests__/index.feature`)

vi.mock(`vitest`, async () => {
    const mod = await vi.importActual<
    typeof import('vitest')
    >(`vitest`)

    return {
        ...mod,
        test : (s : string, fn : () => void) => {
            fn()
        },
        describe : (s: undefined, fn: () => void) => {
            fn()
            return {
                on : (title: string, f: () => void) => {
                    f()
                },
            }
        },
    }
})

beforeEach(() => {
    vi.clearAllMocks()
})

test(`Forgot a scenario`, () => {
    expect(
        () => describeFeature(feature, () => {
            // 
        }),
    ).toThrowError(`Scenario: Forgot a scenario was not called`)
})

test(`Bad scenario name`, () => {
    expect(
        () => describeFeature(feature, ({ Scenario }) => {
            
            Scenario(`Forgot a scenario`, ({ Given, When, Then }) => {
                Given(`Developer using vitest-cucumber`, () => { })
                When(`I forgot a scenario`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
            })

            Scenario(`wrong name`, () => {})
        }),
    ).toThrowError(`Scenario: wrong name doesn't exist in your Feature`)
})

test(`Bad step name`, () => {
    expect(
        () => describeFeature(feature, ({ Scenario }) => {
            
            Scenario(`Forgot a scenario`, ({ Given }) => {
                Given(`Developer using vitest-gherkin`, () => { })
            })

        }),
    ).toThrowError(`Given Developer using vitest-gherkin doesn't exist in your Scenario`)
})

test(`Scenario steps(s) validation`, () => {
    expect(
        () => describeFeature(feature, ({ Scenario }) => {
            
            Scenario(`Forgot a scenario`, ({ Given, When, Then }) => {
                Given(`Developer using vitest-cucumber`, () => { })
                When(`I forgot a scenario`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
            })

            Scenario(`Bad scenario name`, ({ Given, When, Then }) => {
                Given(`Developer using again vitest-cucumber`, () => { })
                When(`I type a wrong scenario name`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
            })

            Scenario(`Scenario steps(s) validation`, ({ Given, When, Then }) => {
                Given(`Developer one more time vitest-cucumber`, () => {})
                When(`I forgot a scenario step`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
            })
        }),

    ).toThrowError(`And I know which steps are missing was not called`)
})

test(`Everything is ok`, () => {
    expect(
        () => describeFeature(feature, ({ Scenario }) => {
            
            Scenario(`Forgot a scenario`, ({ Given, When, Then }) => {
                Given(`Developer using vitest-cucumber`, () => { })
                When(`I forgot a scenario`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
            })

            Scenario(`Bad scenario name`, ({ Given, When, Then }) => {
                Given(`Developer using again vitest-cucumber`, () => { })
                When(`I type a wrong scenario name`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
            })

            Scenario(`Scenario steps(s) validation`, ({ Given, When, Then, And }) => {
                Given(`Developer one more time vitest-cucumber`, () => {})
                When(`I forgot a scenario step`, () => {})
                Then(`vitest-cucumber throw an error`, () => {})
                And(`I know which steps are missing`, () => {})
            })
        }),

    ).not.toThrowError()
})