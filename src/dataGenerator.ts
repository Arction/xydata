import { DataHost } from './dataHost'

/**
 * Feature detected performance.now function
 * @hidden
 */
let perfNow: () => number

// feature detect window.performance.now with checks at all levels.
if ( typeof window !== 'undefined' && window.performance && window.performance.now ) {
    perfNow = window.performance.now
} else {
    // window.performance.now doesn't exist, try to load Node JS version
    try {
        if ( typeof require !== 'undefined' ) {
            perfNow = require( 'perf_hooks' ).performance.now
        } else {
            // require failed, throw an error
            throw new Error()
        }
    } catch ( e ) {
        throw new Error( 'Failed to detect "performance.now" API' )
    }
}

/**
 * Abstract base class for all data generators.
 * Defines a generate function that is used to create new instances of data host.
 * @param T Generator data type
 * @param K Generator options type
 */
export abstract class DataGenerator<T, K> {
    /**
     * Generator options
     */
    protected options: Readonly<K>

    constructor( args: K ) {
        this.options = args
    }

    /**
     * Generate new instance of DataHost with unique data.
     * Data is added to the DataHost asynchronously.
     * @returns A new DataHost.
     */
    generate(): DataHost<T> {
        const dataHost = new DataHost<T>( this.infiniteReset, {
            interval: 500,
            batchSize: 10,
            repeat: false
        } )
        const points = this.getPointCount()
        const nextChunk = this.generateChunks.bind( this, 0, points, dataHost )
        setTimeout( nextChunk, 0 )
        return dataHost
    }

    /**
     * Generate the random data in chunks that can take x ms per chunk.
     * @param baseIndex The current index for the generator.
     * @param total How many data points to generate.
     * @param dataHost The data host to push the data to.
     */
    private generateChunks( baseIndex: number, total: number, dataHost: DataHost<T> ) {
        const startTime = perfNow()
        const points = []
        // Generate data until elapsed time is more than 15 ms or we have generated enough data.
        for ( let i = 0; perfNow() - startTime < 15 && baseIndex < total; i++ ) {
            const point = this.generateDataPoint( baseIndex )
            baseIndex++;
            points.push( point )
        }
        dataHost.push( points )
        if ( baseIndex < total ) {
            const nextChunk = this.generateChunks.bind( this, baseIndex, total, dataHost )
            setTimeout( nextChunk, 0 )
        } else {
            dataHost.freeze()
        }
    }

    /**
     * Abstract function to return how many points the generator should generate.
     * @returns The number of points the generator should generate.
     */
    protected abstract getPointCount(): number

    /**
     * Abstract function for all generators to override.
     * Used to create the random data for the data host.
     * @param index Index of the point to generate.
     * @returns A single data point.
     */
    protected abstract generateDataPoint( index: number ): T

    /**
     * Handles resetting the data when used as infinite stream of data.
     * Used to recalculate the point when it is moved to end of stream.
     * @param dataToReset Data to reset
     * @param data All of the data
     * @returns New data point that should have the contained values adjusted for moving to end of the stream.
     */
    protected abstract infiniteReset( dataToReset: T, data: ReadonlyArray<T> ): T
}
