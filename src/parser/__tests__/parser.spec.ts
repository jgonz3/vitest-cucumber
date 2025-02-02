import { GherkinParser } from "../parser"
import {
    describe, it, expect,
} from 'vitest'
import { StepTypes } from "../step"

describe(`GherkinParser`, () => {

    const parser = new GherkinParser()

    function getCurrentFeaut (p : GherkinParser) {
        const { features } = p
        const [firstFeature] = features

        return firstFeature
    }

    function getCurrentScenario (p : GherkinParser) {
        const feature = getCurrentFeaut(p)
        const [scenario] = feature.scenarii

        return scenario
    }

    it(`should be able to parse Feature line`, () => {
        const featureTitle = `Awesome unit tests`

        parser.addLine(`Feature: ${featureTitle}`)

        const currentFeature = getCurrentFeaut(parser)

        expect(currentFeature).not.toBeUndefined()
        expect(currentFeature.name).toEqual(featureTitle)
        expect(currentFeature.scenarii.length).toEqual(0)
    })

    it(`should be able to parse Scenario line`, () => {
        const scenarioTitile = `Run unit tests`

        parser.addLine(`Scenario: ${scenarioTitile}`)

        const currentFeature = getCurrentFeaut(parser)
        const currentScenario = getCurrentScenario(parser)
        
        expect(currentFeature.scenarii.length).toEqual(1)
        expect(currentScenario.description).toEqual(scenarioTitile)
        expect(currentScenario.steps.length).toEqual(0)
        expect(currentScenario.isCalled).toBeFalsy()
    })

    it(`should be able to parse Given line`, () => {
        const givenTitle = `I run unit tests with vitest`

        parser.addLine(`Given ${givenTitle}`)

        const currentScenario = getCurrentScenario(parser)
        const [currentStep] = currentScenario.steps

        expect(currentScenario.steps.length).toEqual(1)
        expect(currentStep.type).toEqual(StepTypes.GIVEN)
        expect(currentStep.details).toEqual(givenTitle)
        expect(currentStep.isCalled).toBeFalsy()
    })

    it(`should trim Scenario / Feature line title`, () => {
        const lineTitle = `Scenario:    remove space `

        parser.addLine(lineTitle)

        const [feature] = parser.features
        const [, scenario] = feature.scenarii

        expect(scenario.description).toEqual(`remove space`)
    })

    it(`should trim step line title`, () => {
        const lineTitle = `Given    I love spaces in string `

        parser.addLine(lineTitle)

        const [feature] = parser.features
        const [, scenario] = feature.scenarii
        const [step] = scenario.steps

        expect(step.details).toEqual(`I love spaces in string`)
    })

})