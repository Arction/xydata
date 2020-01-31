import { DataGenerator } from '../dataGenerator'
import { OHLCData } from '../dataHost'

/**
 * Options for the OHLC data generator
 */
export interface OHLCGeneratorOptions {
    /**
     * How many points of data to generate.
     */
    numberOfPoints: number
    /**
     * Timestamp of the first data point.
     */
    startTimestamp: number,
    /**
     * How long time there is between two timestamps.
     */
    dataFreq: number,
    /**
     * What is the value the data generation should start at.
     */
    start: number,
    /**
     * How much the data can change.
     */
    volatility: number
}

/**
 * Create a new OHLC data generator with default values.
 * The generator creates random OHLC data.
 */
export function createOHLCGenerator() {
    return new OHLCGenerator( {
        numberOfPoints: 1000,
        startTimestamp: 0,
        dataFreq: 1,
        start: 100,
        volatility: 0.1
    } )
}

/**
 * OHLC data generator.
 * Generates random OHLC data. The open value is derived from the previous close.
 *
 * To create a new instance of OHLC data generator use [[createOHLCGenerator]] factory.
 */
class OHLCGenerator extends DataGenerator<OHLCData, OHLCGeneratorOptions> {
    constructor( args: OHLCGeneratorOptions ) {
        super( args )
    }

    /**
     * Returns a new Data generator with the new numberOfPoints.
     * @param numberOfPoints How many points of data to generate
     */
    setNumberOfPoints( numberOfPoints: number ) {
        return new OHLCGenerator( { ...this.options, numberOfPoints } )
    }

    /**
     * Returns a new Data generator with the new time stamp to start generating the data.
     * @param startTimestamp The timestamp for the first data point.
     */
    setStartTimestamp( startTimestamp: number ) {
        return new OHLCGenerator( { ...this.options, startTimestamp } )
    }

    /**
     * Returns a new Data generator with the new data frequency.
     * @param dataFreq How long the time between two timestamps is.
     */
    setDataFrequency( dataFreq: number ) {
        return new OHLCGenerator( { ...this.options, dataFreq } )
    }

    /**
     * Returns a new Data generator with the new starting value.
     * @param start What is the value the data generation should start from.
     */
    setStart( start: number ) {
        return new OHLCGenerator( { ...this.options, start } )
    }

    /**
     * Returns a new Data generator with the new volatility.
     * @param volatility How volatile the data is. How much the data changes between data points.
     *                   For example volatility of 0.2 would allow maximum of 0.2 change up or down between datapoints.
     */
    setVolatility( volatility: number ) {
        return new OHLCGenerator( { ...this.options, volatility } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfPoints
    }

    private prevPoint = [this.options.startTimestamp, this.options.start, this.options.start, this.options.start, this.options.start]
    protected generateDataPoint( i: number ) {
        let dataPoint: OHLCData = [0, 0, 0, 0, 0]
        const timeStamp = ( this.options.startTimestamp + this.options.dataFreq * i )

        const dir = Math.random() > 0.5 ? 1 : -1
        let newPoints = Array.from( Array( 4 ) ).map( v => {
            let change = Math.random() * this.options.volatility * dir
            if ( this.prevPoint[4] + change < 0 ) {
                change = change * -1
            }
            // All new points are derived from the last points closing value.
            return this.prevPoint[4] + change
        } ).sort( ( a, b ) => a - b )

        if ( dir === -1 ) {
            newPoints = [newPoints[0], newPoints[2], newPoints[1], newPoints[3]]
        }
        dataPoint = [timeStamp, newPoints[1], newPoints[3], newPoints[0], newPoints[2]]
        this.prevPoint = dataPoint
        return dataPoint
    }

    protected infiniteReset( dataToReset: OHLCData, data: OHLCData[] ): OHLCData {
        // base + end-base + point1-point0
        const newPoint = <OHLCData>[
            dataToReset[0] + data.length * ( data[data.length - 1][0] - data[data.length - 2][0] ),
            dataToReset[1],
            dataToReset[2],
            dataToReset[3],
            dataToReset[4]
        ]
        return newPoint
    }
}
