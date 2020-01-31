import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

export type ParametricFunction = ( t: number ) => number

/**
 * Options for Parametric Function generator.
 */
export interface ParametricFunctionOptions {
    /**
     * Function for X-value
     */
    xFunction: ParametricFunction,
    /**
     * Function for Y-value
     */
    yFunction: ParametricFunction,
    /**
     * Start t-value.
     */
    start: number,
    /**
     * End t-value.
     */
    end: number,
    /**
     * Step of `t` between each sample
     */
    step: number
}
/**
 * Create a new Parametric Function generator with default values.
 * The generator samples a given X and Y functions for each `t` step in the start - end range.
 */
export function createParametricFunctionGenerator() {
    return new ParametricFunctionGenerator( {
        xFunction: ( t ) => 3 * Math.cos( 3 * t ),
        yFunction: ( t ) => 3 * Math.sin( 4 * t ),
        start: 0,
        end: 1000,
        step: 0.5
    } )
}
/**
 * A Parametric function data generator.
 * Generates point data by sampling X and Y functions with for each step `t`.
 *
 * To create a new instance of Parametric function data generator use [[createParametricFunctionGenerator]] factory.
 */
class ParametricFunctionGenerator extends DataGenerator<Point, ParametricFunctionOptions> {
    private t = this.options.start
    /**
     * Number of points that generator is able to generate.
     * Computed from start, end and step values.
     */
    private readonly numberOfPoints: number

    constructor( args: ParametricFunctionOptions ) {
        super( args )

        const opts = {
            xFunction: args.xFunction,
            yFunction: args.yFunction,
            start: args.start,
            end: args.end,
            step: args.step
        }
        this.options = Object.freeze( opts )
        this.numberOfPoints = Math.ceil( Math.abs( opts.end - opts.start ) / opts.step )
    }
    /**
     * Returns a new Parametric function generator with the new X-value sampling function.
     * @param handler A function that is sampled to generate the data.
     */
    setXFunction( handler: ParametricFunction ) {
        return new ParametricFunctionGenerator( { ...this.options, xFunction: handler } )
    }
    /**
     * Returns a new Parametric function generator with the new Y-value sampling function.
     * @param handler A function that is sampled to generate the data.
     */
    setYFunction( handler: ParametricFunction ) {
        return new ParametricFunctionGenerator( { ...this.options, yFunction: handler } )
    }
    /**
     * Returns a new Parametric function generator with the new start t-value.
     * @param   start   Start t-value
     */
    setStart( start: number ) {
        return new ParametricFunctionGenerator( { ...this.options, start } )
    }
    /**
     * Returns a new Parametric function generator with the new end t-value.
     * @param   end   End t-value
     */
    setEnd( end: number ) {
        return new ParametricFunctionGenerator( { ...this.options, end } )
    }
    /**
     * Returns a new Parametric function generator with the new t-step.
     * @param   step   t-step between each sample.
     */
    setStep( step: number ) {
        return new ParametricFunctionGenerator( { ...this.options, step } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.numberOfPoints
    }

    protected generateDataPoint() {
        const point = {
            x: this.options.xFunction( this.t ),
            y: this.options.yFunction( this.t )
        }
        this.t = this.t + this.options.step
        return point
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data.length * ( data[data.length - 1].x - data[data.length - 2].x ), y: dataToReset.y }
    }
}
