/**
 * Controls what is exported
 */

// Generators
export { createProgressiveRandomGenerator } from './generators/progressiveRandom'
export { createProgressiveTraceGenerator } from './generators/progressiveTrace'
export { createProgressiveFunctionGenerator } from './generators/progressiveFunction'
export { createTraceGenerator } from './generators/trace'
export { createOHLCGenerator } from './generators/OHLC'
export { createDeltaFunctionGenerator } from './generators/deltaFunction'
export { createWhiteNoiseGenerator } from './generators/whiteNoise'
export { createSampledDataGenerator } from './generators/sampledData'
export { createParametricFunctionGenerator } from './generators/parametricFunction'
export { createSpectrumDataGenerator } from './generators/spectrumData'

// Base classes
export { Stream } from './stream'
export { DataGenerator } from './dataGenerator'
export { DataHost } from './dataHost'
