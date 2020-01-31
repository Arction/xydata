import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

/**
 * Options for the Progressive random data generator.
 */
export interface ProgressiveRandomOptions {
    /**
     * How many points of data to generate.
     */
    numberOfPoints: number
    /**
     * How often to change the offset.
     */
    offsetStep: number,
    /**
     * Maximum change of the offset during one step.
     * Values higher than max are forced to max.
     */
    offsetDeltaMax: number,
    /**
     * Minimum change of the offset during one step.
     * Values lower than min are forec to min.
     */
    offsetDeltaMin: number,
    /**
     * Maximum value for the random data before addding the offset.
     * Values higher than max are forced to max.
     */
    dataMax: number
}

/**
 * Create a new Progressive Random Generator with default values.
 * The generator creates random data on Y-axis with progressive X-axis.
 */
export function createProgressiveRandomGenerator() {
    return new ProgressiveRandomGenerator( {
        numberOfPoints: 1000,
        offsetStep: 10,
        offsetDeltaMax: 0.3,
        offsetDeltaMin: 0.1,
        dataMax: 0.5
    } )
}

/**
 * Progressive random data generator.
 * Generates random points with progressive X axis.
 * The data is offset by an random amount. The data is random between the offset delta min and min + data max.
 * Generated data is between 0 and 1.
 *
 * To create a new instance of Progressive random data generator use [[createProgressiveRandomGenerator]] factory.
 */
class ProgressiveRandomGenerator extends DataGenerator<Point, ProgressiveRandomOptions> {
    constructor( args: ProgressiveRandomOptions ) {
        super( args )

        // Setup defaults and make sure args are valid
        const opts = {
            numberOfPoints: args.numberOfPoints,
            offsetStep: args.offsetStep === 0 ? 0 : args.offsetStep,
            offsetDeltaMax: Math.min( args.offsetDeltaMax, 1 ),
            offsetDeltaMin: Math.max( args.offsetDeltaMin === 0 ? 0 : args.offsetDeltaMin, 0 ),
            dataMax: Math.min( args.dataMax, 1 )
        }
        this.options = Object.freeze( opts )
    }

    /**
     * Returns a new Data generator with the new numberOfPoints.
     * @param numberOfPoints How many points of data to generate
     */
    setNumberOfPoints( numberOfPoints: number ) {
        return new ProgressiveRandomGenerator( { ...this.options, numberOfPoints } )
    }

    /**
     * Returns a new Data generator with the new offsetStep.
     * @param offsetStep How often to change the offset
     */
    setOffsetStep( offsetStep: number ) {
        return new ProgressiveRandomGenerator( { ...this.options, offsetStep } )
    }

    /**
     * Returns a new Data generator with the new offsetDeltaMax.
     * @param offsetDeltaMax Maximum change of offset during one step.
     */
    setOffsetDeltaMax( offsetDeltaMax: number ) {
        return new ProgressiveRandomGenerator( { ...this.options, offsetDeltaMax } )
    }

    /**
     * Returns a new Data generator with the new offsetDeltaMin.
     * @param offsetDeltaMin Minimum change of offset during one step.
     */
    setOffsetDeltaMin( offsetDeltaMin: number ) {
        return new ProgressiveRandomGenerator( { ...this.options, offsetDeltaMin } )
    }

    /**
     * Returns a new Data generator with the new dataMax.
     * @param dataMax Maximum value for the random data before addding the offset.
     */
    setDataMax( dataMax: number ) {
        return new ProgressiveRandomGenerator( { ...this.options, dataMax } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfPoints
    }

    private offset: number = 0.5
    /**
     * Generate a new Progressive random data point.
     * @param i Index of point.
     */
    protected generateDataPoint( i: number ) {
        if ( i % this.options.offsetStep === 0 || i === 0 ) {
            const newOffset = Math.random() * ( this.options.offsetDeltaMax - this.options.offsetDeltaMin ) + this.options.offsetDeltaMin
            this.offset = Math.random() > 0.5 ? this.offset + newOffset : this.offset - newOffset
        }
        // Limit the offset so that data is newer lower than 0 or higher than 1
        if ( this.offset + this.options.dataMax > 1 ) {
            this.offset = 1 - this.options.dataMax
        } else if ( this.offset < 0 ) {
            this.offset = 0
        }

        return {
            x: i,
            y: this.offset + Math.random() * this.options.dataMax
        }
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data.length, y: dataToReset.y }
    }
}
