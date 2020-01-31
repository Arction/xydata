import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

/**
 * Options for progressive trace generator.
 */
export interface ProgressiveTraceGeneratorOptions {
    /**
     * How many points of data to generate.
     */
    numberOfPoints: number
}

/**
 * Create a new Progressive Trace generator with default values.
 * The generator creates random data with progressive X axis and random Y axis.
 */
export function createProgressiveTraceGenerator() {
    return new ProgressiveTraceGenerator( {
        numberOfPoints: 1000
    } )
}

/**
 * A progressive trace data generator.
 * Generates point data that has progressive X axis. The data is always derived from the previous point.
 *
 * To create a new instance of progressive trace data generator use [[createProgressiveTraceGenerator]] factory.
 */
class ProgressiveTraceGenerator extends DataGenerator<Point, ProgressiveTraceGeneratorOptions> {
    constructor( args: ProgressiveTraceGeneratorOptions ) {
        super( args )
        const opts = {
            numberOfPoints: args.numberOfPoints
        }

        this.options = Object.freeze( opts )
    }

    /**
     * Returns a new Data generator with the new numberOfPoints.
     * @param numberOfPoints How many points of data to generate
     */
    setNumberOfPoints( numberOfPoints: number ) {
        return new ProgressiveTraceGenerator( { ...this.options, numberOfPoints } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfPoints
    }

    private previousPoint = { x: 0, y: 0 }
    protected generateDataPoint( i: number ) {
        const point = {
            x: i,
            y: this.previousPoint.y + ( Math.random() - 0.5 ) * 2
        }
        this.previousPoint = point
        return point
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data.length, y: dataToReset.y }
    }
}
