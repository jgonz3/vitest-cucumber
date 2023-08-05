
export enum StepTypes {
    THEN = `Then`,
    AND = `And`,
    WHEN = `When`,
    GIVEN = `Given`,
    BUT = `But`,
}

export class Step {

    public readonly type : StepTypes
    
    public readonly details : string

    public isCalled : boolean

    public constructor (type : StepTypes, details : string) {
        this.details = details
        this.type = type
        this.isCalled = false
    }

}