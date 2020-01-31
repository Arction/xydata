import { DataGenerator } from '../dataGenerator'

/**
 * Options for Sampled data generator.
 */
interface SampledDataGeneratorOptions<T> {
    /**
     * The input data to sample as per the sampling frequency.
     */
    inputData: T[],
    /**
     * How often to sample the data. (Hz)
     */
    samplingFrequency: number,
    /**
     * A constant step between sampling
     */
    step: number
}

/**
 * Structure for the sampled point.
 * @param T Data type for the data that the generator samples.
 */
export interface SampledPoint<T> {
    /**
     * The timestamp for this data point.
     */
    timestamp: number,
    /**
     * The value from the input array that has been sampled.
     */
    data: T
}

/**
 * Create a new Sampled data generator with default values.
 * The generator samples the given input data array at specific frequency.
 * @param T Data type for the data that the generator samples.
 */
export function createSampledDataGenerator<T>() {
    return new SampledDataGenerator<T>( {
        inputData: [],
        samplingFrequency: 50,
        step: 0
    } )
}

/**
 * A sampled data generator.
 * Samples given data with specific frequency.
 * @param T Data type for the data that the generator samples.
 *
 * To create a new instance of sampled data generator use [[createSampledDataGenerator]] factory.
 */
class SampledDataGenerator<T> extends DataGenerator<SampledPoint<T>, SampledDataGeneratorOptions<T>> {
    private interval = 1 / ( this.options.samplingFrequency || 10 )
    constructor( args: SampledDataGeneratorOptions<T> ) {
        super( args )
        const opts = {
            inputData: args.inputData,
            samplingFrequency: args.samplingFrequency,
            step: args.step
        }
        this.options = Object.freeze( opts )
    }

    /**
     * Returns a new Data generator with new the new array of data as sampling target.
     * @param inputData Array of data to sample.
     */
    setInputData( inputData: T[] ) {
        return new SampledDataGenerator( { ...this.options, inputData } )
    }

    /**
     * Returns a new Data generator with the new sampling frequency.
     * @param samplingFrequency Set the frequency that the data is sampled from the input array.
     */
    setSamplingFrequency( samplingFrequency: number ) {
        return new SampledDataGenerator( { ...this.options, samplingFrequency } )
    }

    /**
     * Returns a new Data generator with the new step.
     * @param step A constant step between samplings.
     */
    setStep( step: number ) {
        return new SampledDataGenerator( { ...this.options, step } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.inputData.length
    }

    protected generateDataPoint( i: number ) {
        const point: SampledPoint<T> = {
            timestamp: i * this.interval + i * this.options.step,
            data: this.options.inputData[i]
        }
        return point
    }

    protected infiniteReset( dataToReset: SampledPoint<T>, data: SampledPoint<T>[] ): SampledPoint<T> {
        return { timestamp: dataToReset.timestamp + data[data.length - 1].timestamp, data: dataToReset.data }
    }
}
