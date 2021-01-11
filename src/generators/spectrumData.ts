import { DataGenerator } from '../dataGenerator'

/**
 * Options for the Spectrum data generator.
 */
export interface SpectrumDataOptions {

    /**
     * How many samples to generate.
     */
    numberOfSamples: number

    /**
     * How many values are in a single spectrum sample.
     */
    sampleSize: number

    /**
     * Variation between adjacent points in range 0...100.
     */
    variation: number

    /**
     * Frequency drifting also depends on Variation, which effects especially in low Frequency Stability amounts.
     */
    frequencyStability: number

    /**
     * Factor that alters the narrowness of first spectrum channel.
     */
    narrowFactor1: number

    /**
     * Factor that alters the narrowness of second spectrum channel.
     */
    narrowFactor2: number
}

const defaultOptions: SpectrumDataOptions = {
    numberOfSamples: 1000,
    sampleSize: 10,
    variation: 10.0,
    frequencyStability: 1.0,
    narrowFactor1: 8.0,
    narrowFactor2: 24.0
}

/**
 * Create a new Spectrum Data Generator with default values.
 */
export function createSpectrumDataGenerator() {
    return new SpectrumDataGenerator( defaultOptions )
}

/**
 * Spectrum data generator.
 * Generates rows of random numbers that can be used to mimic spectrum data.
 * Generated data is between 0 and 1.
 *
 * To create a new instance of Spectrum data generator use [[createSpectrumDataGenerator]] factory.
 */
class SpectrumDataGenerator extends DataGenerator<number[], SpectrumDataOptions> {
    constructor( args: SpectrumDataOptions ) {
        super( args )

        // Setup defaults and make sure args are valid
        const opts: SpectrumDataOptions = {
            sampleSize: args.sampleSize !== undefined ? args.sampleSize : defaultOptions.sampleSize,
            numberOfSamples: args.numberOfSamples !== undefined ? args.numberOfSamples : defaultOptions.numberOfSamples,
            variation: args.variation !== undefined ? args.variation : defaultOptions.variation,
            frequencyStability: args.frequencyStability !== undefined ? args.frequencyStability : defaultOptions.frequencyStability,
            narrowFactor1: args.narrowFactor1 !== undefined ? args.narrowFactor1 : defaultOptions.narrowFactor1,
            narrowFactor2: args.narrowFactor2 !== undefined ? args.narrowFactor2 : defaultOptions.narrowFactor2
        }
        this.options = Object.freeze( opts )
    }

    /**
     * Returns a new Data generator with the new numberOfSamples.
     * @param numberOfSamples How many samples to generate
     */
    setNumberOfSamples( numberOfSamples: number ) {
        return new SpectrumDataGenerator( { ...this.options, numberOfSamples } )
    }

    /**
     * Returns a new Data generator with the new sampleSize.
     * @param sampleSize How many values are in a single spectrum sample.
     */
    setSampleSize( sampleSize: number ) {
        return new SpectrumDataGenerator( { ...this.options, sampleSize } )
    }

    /**
     * Returns a new Data generator with the new variation.
     * @param variation Variation between adjacent points in range 0...100.
     */
    setVariation( variation: number ) {
        return new SpectrumDataGenerator( { ...this.options, variation } )
    }

    /**
     * Returns a new Data generator with the new frequencyStability.
     * @param frequencyStability    Frequency drifting also depends on Variation,
     *                              which effects especially in low Frequency Stability amounts.
     */
    setFrequencyStability( frequencyStability: number ) {
        return new SpectrumDataGenerator( { ...this.options, frequencyStability } )
    }

    /**
     * Returns a new Data generator with the new narrowFactor1.
     * @param narrowFactor1 Factor that alters the narrowness of first spectrum channel.
     */
    setNarrowFactor1( narrowFactor1: number ) {
        return new SpectrumDataGenerator( { ...this.options, narrowFactor1 } )
    }

    /**
     * Returns a new Data generator with the new narrowFactor2.
     * @param narrowFactor2 Factor that alters the narrowness of second spectrum channel.
     */
    setNarrowFactor2( narrowFactor2: number ) {
        return new SpectrumDataGenerator( { ...this.options, narrowFactor2 } )
    }

    /**
     * Returns how many points of data the generator should generate.
     */
    protected getPointCount() {
        return this.options.numberOfSamples
    }

    /**
     * Generate a new row of Spectrum data.
     * @param iPoint Index of point.
     */
    protected generateDataPoint( iPoint: number ) {
        const m_dInitialValue = 10.0
        // NOTE: Data is scaled to [0, 1] at the very end.
        const m_dMax = 100
        const m_dMin = 0
        // [0, 100] Variation between adjacent points in range 0...100.
        const m_dVariation = this.options.variation
        const m_iRowLength = this.options.sampleSize
        // [0, 100]  Frequency drifting also depends on Variation, which effects especially in low Frequency Stability amounts.
        const m_dFrequencyStability = this.options.frequencyStability

        let m_dPeak1X = m_iRowLength / 8.0
        let m_dPeak2X = m_iRowLength / 2.0



        const aNewData = new Array( m_iRowLength )

        for ( let i = 0; i < m_iRowLength; i++ )
            aNewData[i] = m_dInitialValue

        //Calc new data
        const dHalf = m_iRowLength / 2.0
        m_dPeak1X += ( Math.random() - 0.5 ) * m_dVariation / m_dFrequencyStability / 100.0 * m_iRowLength / 2.0
        m_dPeak2X += ( Math.random() - 0.5 ) * m_dVariation / m_dFrequencyStability / 100.0 * m_iRowLength
        if ( m_dPeak1X < 0 )
            m_dPeak1X = 0
        if ( m_dPeak1X > m_iRowLength )
            m_dPeak1X = m_iRowLength
        if ( m_dPeak2X < 0 )
            m_dPeak2X = 0
        if ( m_dPeak2X > m_iRowLength )
            m_dPeak2X = m_iRowLength


        let dNewValue1
        let dNewValue2
        let dX1
        let dX2
        const dPeakY1 = m_dMax / 3.0 * 2.0
        const dPeakY2 = m_dMax / 2.0
        const dNarrowFactor1 = this.options.narrowFactor1
        const dNarrowFactor2 = this.options.narrowFactor2

        const dA1 = dPeakY1 / ( dHalf * dHalf ) * dNarrowFactor1
        const dA2 = dPeakY2 / ( dHalf * dHalf ) * dNarrowFactor2
        let dSum12
        for ( let i = 0; i < m_iRowLength; i++ ) {
            dX1 = 0.8 * i - m_dPeak1X
            dX2 = 0.8 * i - m_dPeak2X
            dNewValue1 = dPeakY1 - dX1 * dX1 * dA1
            if ( dNewValue1 < m_dMin )
                dNewValue1 = m_dMin
            if ( dNewValue1 > m_dMax )
                dNewValue1 = m_dMax

            dNewValue2 = dPeakY2 - dX2 * dX2 * dA2
            if ( dNewValue2 < m_dMin )
                dNewValue2 = m_dMin
            if ( dNewValue2 > m_dMax )
                dNewValue2 = m_dMax

            dSum12 = dNewValue1 + dNewValue2
            dSum12 = dSum12 + dSum12 * ( Math.random() - 0.5 ) * m_dVariation / 10.0

            aNewData[i] = ( aNewData[i] + dSum12 ) / 2.0
            if ( aNewData[i] < m_dMin )
                aNewData[i] = m_dMin
            if ( aNewData[i] > m_dMax )
                aNewData[i] = m_dMax

            // Scale to [0, 1]
            aNewData[i] = aNewData[i] * 0.02
        }

        return aNewData
    }

    protected infiniteReset( dataToReset: number[], data: number[][] ): number[] {
        return dataToReset.slice()
    }
}
