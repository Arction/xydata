import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

/**
 * Options for White noise generator.
 */
export interface WhiteNoiseGeneratorOptions {
    /**
     * How many points of data to generate.
     */
    numberOfPoints: number
}

/**
 * Create a new White noise generator with default values.
 * The generator creates white noise between -1 and 1.
 */
export function createWhiteNoiseGenerator() {
    return new WhiteNoiseGenerator( {
        numberOfPoints: 1000
    } )
}

/**
 * A white noise data generator.
 * Generates white noise.
 *
 * To create a new instance of white noise data generator use [[createWhiteNoiseGenerator]] factory.
 */
class WhiteNoiseGenerator extends DataGenerator<Point, WhiteNoiseGeneratorOptions> {
    constructor( args: WhiteNoiseGeneratorOptions ) {
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
        return new WhiteNoiseGenerator( this.options ? { ...this.options, numberOfPoints } : { numberOfPoints } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfPoints
    }

    protected generateDataPoint( i: number ) {
        const point = {
            x: i,
            y: ( Math.random() - 0.5 ) * 2
        }
        return point
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data[data.length - 1].x, y: dataToReset.y + data[data.length - 1].y }
    }
}
