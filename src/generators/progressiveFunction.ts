import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

/**
 * Options for progressive function generator.
 */
export interface ProgressiveFunctionOptions {
    /**
     * A function that is sampled to generate the data.
     */
    samplingFunction: ( x: number ) => number,
    /**
     * Start X-value.
     */
    start: number,
    /**
     * End X-value.
     */
    end: number,
    /**
     * X-step between each continuous sample.
     */
    step: number
}
/**
 * Create a new Progressive Function generator with default values.
 * The generator samples a given function x times between given X range.
 */
export function createProgressiveFunctionGenerator() {
    return new ProgressiveFunctionGenerator( {
        samplingFunction: ( x ) => x * x,
        start: 0,
        end: 100,
        step: 1
    } )
}
/**
 * A progressive function data generator.
 * Generates point data that has progressive X axis and the value for Y axis is created from the user given function.
 *
 * To create a new instance of progressive function data generator use [[createProgressiveFunctionGenerator]] factory.
 */
class ProgressiveFunctionGenerator extends DataGenerator<Point, ProgressiveFunctionOptions> {
    private x = this.options.start
    /**
     * Number of points that generator is able to generate.
     * Computed from start, end and step values.
     */
    private readonly numberOfPoints: number

    constructor( args: ProgressiveFunctionOptions ) {
        super( args )

        const opts = {
            samplingFunction: args.samplingFunction,
            start: args.start,
            end: args.end,
            step: args.step
        }
        this.options = Object.freeze( opts )
        this.numberOfPoints = Math.ceil( Math.abs( opts.end - opts.start ) / opts.step )
    }
    /**
     * Returns a new Progressive function generator with the new sampling function.
     * @param handler A function that is sampled to generate the data.
     */
    setSamplingFunction( handler: ( x: number ) => number ) {
        return new ProgressiveFunctionGenerator( { ...this.options, samplingFunction: handler } )
    }
    /**
     * Returns a new Progressive function generator with the new start X-value.
     * @param   start   Start X-value
     */
    setStart( start: number ) {
        return new ProgressiveFunctionGenerator( { ...this.options, start } )
    }
    /**
     * Returns a new Progressive function generator with the new end X-value.
     * @param   end   End X-value
     */
    setEnd( end: number ) {
        return new ProgressiveFunctionGenerator( { ...this.options, end } )
    }
    /**
     * Returns a new Progressive function generator with the new X-step.
     * @param   step   X-step between each continuous sample.
     */
    setStep( step: number ) {
        return new ProgressiveFunctionGenerator( { ...this.options, step } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.numberOfPoints
    }

    protected generateDataPoint() {
        const point = {
            x: this.x,
            y: this.options.samplingFunction( this.x )
        }
        this.x = this.x + this.options.step
        return point
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data.length * ( data[data.length - 1].x - data[data.length - 2].x ), y: dataToReset.y }
    }
}
