import { DataGenerator } from '../dataGenerator'
import { Point } from '../dataHost'

/**
 * Options for the Delta function generator.
 */
export interface DeltaFunctionOptions {
    /**
     * How many points of data to generate.
     */
    numberOfPoints: number
    /**
     * How many points there has to be between spikes.
     */
    minGap: number,
    /**
     * How many points there can be between spikes.
     */
    maxGap: number,
    /**
     * The minium spike height.
     */
    minAmplitude: number,
    /**
     * The maximum spike height.
     */
    maxAmplitude: number,
    /**
     * The probability of a spike to generate on each step.
     */
    probability: number
}

/**
 * Create a new Delta function generator with default values.
 * The generator creates flat progressive data with random spikes.
 */
export function createDeltaFunctionGenerator() {
    return new DeltaFunctionGenerator( {
        numberOfPoints: 1000,
        minGap: 1,
        maxGap: -1,
        minAmplitude: 0.1,
        maxAmplitude: 1,
        probability: 0.02
    } )
}

/**
 * A Delta function generator.
 * Generates random spikes in otherwise flat data. Generated data is between 0 and 1.
 *
 * To create a new instance of Delta function generator use [[createDeltaFunctionGenerator]] factory.
 */
class DeltaFunctionGenerator extends DataGenerator<Point, DeltaFunctionOptions> {
    constructor( args: DeltaFunctionOptions ) {
        super( args )

        // Setup defaults and make sure args are valid
        const opts = {
            numberOfPoints: args.numberOfPoints,
            minGap: args.minGap,
            maxGap: args.maxGap,
            minAmplitude: args.minAmplitude,
            maxAmplitude: args.maxAmplitude,
            probability: args.probability
        }
        this.options = Object.freeze( opts )
    }

    /**
     * Returns a new Data generator with the new numberOfPoints.
     * @param numberOfPoints How many points of data to generate.
     */
    setNumberOfPoints( numberOfPoints: number ) {
        return new DeltaFunctionGenerator( { ...this.options, numberOfPoints } )
    }

    /**
     * Returns a new Data generator with the new minGap.
     * @param minGap How many points there has to be between spikes.
     */
    setMinGap( minGap: number ) {
        return new DeltaFunctionGenerator( { ...this.options, minGap } )
    }

    /**
     * Returns a new Data generator with the new maxGap.
     * @param maxGap How many points there can be between spikes.
     */
    setMaxGap( maxGap: number ) {
        return new DeltaFunctionGenerator( { ...this.options, maxGap } )
    }

    /**
     * Returns a new Data generator with the new minAmplitude.
     * @param minAmplitude The minium spike height.
     */
    setMinAmplitude( minAmplitude: number ) {
        return new DeltaFunctionGenerator( { ...this.options, minAmplitude } )
    }

    /**
     * Returns a new Data generator with the new maxAmplitude.
     * @param maxAmplitude The maximum spike height.
     */
    setMaxAmplitude( maxAmplitude: number ) {
        return new DeltaFunctionGenerator( { ...this.options, maxAmplitude } )
    }

    /**
     * Returns a new Data generator with the new probability.
     * @param probability The probability of a spike to generate on each step.
     */
    setProbability( probability: number ) {
        return new DeltaFunctionGenerator( { ...this.options, probability } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfPoints
    }

    private lastSpike = 0
    protected generateDataPoint( i: number ) {
        const sinceLast = i - this.lastSpike
        const value = { x: i, y: 0 }
        if ( sinceLast > this.options.minGap || this.options.minGap === -1 ) {
            if ( sinceLast < this.options.maxGap || this.options.maxGap === -1 ) {
                // Create random spike randomly.
                const doSpike = Math.random() > ( 1 - this.options.probability )
                if ( doSpike ) {
                    value.y = Math.random() * ( this.options.maxAmplitude - this.options.minAmplitude ) + this.options.minAmplitude
                    this.lastSpike = i
                }
            } else if ( sinceLast >= this.options.maxGap ) {
                // Always create a spike if we are above the max gap.
                value.y = Math.random() * ( this.options.maxAmplitude - this.options.minAmplitude ) + this.options.minAmplitude
                this.lastSpike = i
            }
        }
        return value
    }

    protected infiniteReset( dataToReset: Point, data: Point[] ): Point {
        return { x: dataToReset.x + data.length, y: dataToReset.y }
    }
}
