// Generator for heat map data (2 dimensional plane, XY, where each XY coordinate is associated with an intensity value).
// Can be configured with arbitrary number of "water drops", which are like spots of more exposed area in the generated heat map data. 

/**
 * Water Drop data generator generation options.
 */
export interface WaterDropDataOptions {
    /**
     * Size of output array.
     */
    rows: number
    /**
     * Size of output arrays nested arrays.
     */
    columns: number
    /**
     * Row positions of water drops. Normalized, range = [0, 1]
     */
    rowPositionsNormalized: number[]
    /**
     * Column positions of water drops. Normalized, range = [0, 1]
     */
    columnPositionsNormalized: number[]
    /**
     * Amplitudes of water drops.
     */
    amplitudes: number[]
    /**
     * Offset level (mid-Y)
     */
    offsetLevel: number
    /**
     * Volatility, set larger number to generate more waves for each drop
     */
    volatility: number
}

const defaultOptions: WaterDropDataOptions = {
    rows: 10,
    columns: 10,
    rowPositionsNormalized: [0.2, 0.5, 0.7],
    columnPositionsNormalized: [0.6, 0.5, 0.3],
    amplitudes: [15, 50, 3],
    offsetLevel: 47,
    volatility: 25
}

/**
 * Type definition for data generated by WaterDropDataGenerator.
 *
 * Multidimensional number Array, where intensity value at given row & column can be accessed by:
 * ```ts
 * const intensity = WaterDropData[ row ][ column ]
 * ```
 */
export type WaterDropData = number[][]

/**
 * Create a new WaterDropDataGenerator with default values.
 */
export function createWaterDropDataGenerator() {
    return new WaterDropDataGenerator( defaultOptions )
}

/**
 * Water drop data generator.
 * Generates grid of data containing "water drops", which are like spots of more exposed area in the generated heat map data. 
 * Generated data range depends on the [[WaterDropDataOptions]].
 *
 * To create a new instance of Water drop data generator use [[createWaterDropDataGenerator]] factory.
 */
class WaterDropDataGenerator {

    readonly options: WaterDropDataOptions

    constructor( args: WaterDropDataOptions ) {
        // Setup defaults and make sure args are valid
        const opts: WaterDropDataOptions = {
            rows: args.rows !== undefined ? args.rows : defaultOptions.rows,
            columns: args.columns !== undefined ? args.columns : defaultOptions.columns,
            rowPositionsNormalized:
                args.rowPositionsNormalized !== undefined ? args.rowPositionsNormalized : defaultOptions.rowPositionsNormalized,
            columnPositionsNormalized:
                args.columnPositionsNormalized !== undefined ? args.columnPositionsNormalized : defaultOptions.columnPositionsNormalized,
            amplitudes: args.amplitudes !== undefined ? args.amplitudes : defaultOptions.amplitudes,
            offsetLevel: args.offsetLevel !== undefined ? args.offsetLevel : defaultOptions.offsetLevel,
            volatility: args.volatility !== undefined ? args.volatility : defaultOptions.volatility
        }
        this.options = Object.freeze( opts )
    }

    /**
     * Returns a new Data generator with the new rows amount.
     * @param rows  Rows amount
     */
    setRows( rows: number ) {
        return new WaterDropDataGenerator( { ...this.options, rows } )
    }
    /**
     * Returns a new Data generator with the new columns amount.
     * @param columns  Columns amount
     */
    setColumns( columns: number ) {
        return new WaterDropDataGenerator( { ...this.options, columns } )
    }
    /**
     * Returns a new Data generator with the new rows amount.
     * @param waterDrops    Water drops configuration.
     *                      **Normalized parameters in range [0, 1]**
     */
    setWaterDrops( waterDrops: Array<{
        rowNormalized: number,
        columnNormalized: number,
        amplitude: number
    }> ) {
        const rowPositionsNormalized = waterDrops.map( ( waterDrop ) => waterDrop.rowNormalized )
        const columnPositionsNormalized = waterDrops.map( ( waterDrop ) => waterDrop.columnNormalized )
        const amplitudes = waterDrops.map( ( waterDrop ) => waterDrop.amplitude )
        return new WaterDropDataGenerator( { ...this.options, rowPositionsNormalized, columnPositionsNormalized, amplitudes } )
    }
    /**
     * Returns a new Data generator with the new offsetLevel.
     * @param offsetLevel    Offset level (mid-Y)
     */
    setOffsetLevel( offsetLevel: number ) {
        return new WaterDropDataGenerator( { ...this.options, offsetLevel } )
    }
    /**
     * Returns a new Data generator with the new volatility.
     * @param volatility  Volatility, set larger number to generate more waves for each drop
     */
    setVolatility( volatility: number ) {
        return new WaterDropDataGenerator( { ...this.options, volatility } )
    }

    /**
     * Generate WaterDropData asynchronously.
     * 
     * > NOTE: WaterDropData doesn't support the use of a DataHost and as such doesn't provide method to stream the data.
     * > Instead the data is all provided at the same time as a Promise.
     */
    generate(): Promise<WaterDropData> {
        return new Promise( async ( resolve ) => {

            const sizeX = this.options.rows
            const sizeZ = this.options.columns
            const xPositionsNormalized = this.options.rowPositionsNormalized
            const zPositionsNormalized = this.options.columnPositionsNormalized
            const amplitudes = this.options.amplitudes
            const offsetLevel = this.options.offsetLevel
            const volatility = this.options.volatility

            /**
             * Oscillator properties.
             */
            interface Oscillator {
                centerX: number
                centerZ: number
                amplitude: number
                offsetY: number
                gain: number
            }
            /**
             * Calculate waves at given point.
             * @param x wave origin x-coordinate.
             * @param z wave origin z-coordinate.
             * @param oscillators Oscillators.
             * @param volatility Volatility.
             * @returns wave height at given point.
             */
            function CalculateWavesAtPoint(
                x: number,
                z: number
            ) {
                let resultValue = 0
                const iOscillatorCount = oscillators.length
                for ( let i = 0; i < iOscillatorCount; i++ ) {
                    const oscillator = oscillators[i]
                    const distX = x - oscillator.centerX
                    const distZ = z - oscillator.centerZ
                    const dist = Math.sqrt( distX * distX + distZ * distZ )
                    resultValue += oscillator.gain * oscillator.amplitude * Math.cos( dist * volatility ) * Math.exp( -dist * 3.0 )
                }
                return resultValue
            }

            const iOscCount = amplitudes.length
            const oscillators: Oscillator[] = Array<Oscillator>( iOscCount )

            for ( let iOsc = 0; iOsc < iOscCount; iOsc++ ) {
                oscillators[iOsc] = {
                    amplitude: amplitudes[iOsc],
                    centerX: xPositionsNormalized[iOsc],
                    centerZ: zPositionsNormalized[iOsc],
                    gain: 1,
                    offsetY: 0
                }
            }

            const result = Array.from( Array( sizeX ) ).map( () => Array<number>( sizeZ ) )
            const dTotalX = 1
            const dTotalZ = 1
            const stepX = ( dTotalX / sizeX )
            const stepZ = ( dTotalZ / sizeZ )

            let lastTimeout = Date.now()
            let iDataPoint = 0
            for ( let row = 0, z = 0; row < sizeZ; row++, z += stepZ ) {
                for ( let col = 0, x = 0; col < sizeX; col++, x += stepX ) {
                    result[col][row] = CalculateWavesAtPoint( x, z ) + offsetLevel
                    iDataPoint++
                    if ( iDataPoint > 0 && iDataPoint % 1000 === 0 ) {
                        // Check if timeout should be triggered.
                        if ( Date.now() - lastTimeout >= 15 ) {
                            // Timeout.
                            await new Promise( clbk => setTimeout( clbk, 0 ) )
                            lastTimeout = Date.now()
                        }
                    }
                }
            }
            resolve( result )

        } )
    }

}
