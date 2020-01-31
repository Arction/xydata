import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

/**
 * Options for trace generator.
 */
export interface TraceGeneratorOptions {
    /**
     * How many points of data to generate.
     */
    numberOfPoints: number
}

/**
 * Create a new Trace generator with default values.
 * The generator creates random XY data where each point is based on previous point.
 */
export function createTraceGenerator() {
    return new TraceGenerator( {
        numberOfPoints: 1000
    } )
}

/**
 * A trace data generator.
 * Generates random points that can go to any direction from the previous point.
 *
 * To create a new instance of trace data generator use [[createTraceGenerator]] factory.
 */
class TraceGenerator extends DataGenerator<Point, TraceGeneratorOptions> {
    constructor( args: TraceGeneratorOptions ) {
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
        return new TraceGenerator( { ...this.options, numberOfPoints } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfPoints
    }

    private previous = { x: 0, y: 0 }
    protected generateDataPoint() {
        const point = {
            x: this.previous.x + ( Math.random() - 0.5 ) * 2,
            y: this.previous.y + ( Math.random() - 0.5 ) * 2
        }
        this.previous = point
        return point
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data[data.length - 1].x, y: dataToReset.y + data[data.length - 1].y }
    }
}
