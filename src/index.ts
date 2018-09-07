/**
 * Controls what is exported
 */

export { createProgressiveRandomGenerator } from './generators/progressiveRandom'
export { createProgressiveTraceGenerator } from './generators/progressiveTrace'
export { createProgressiveFunctionGenerator } from './generators/progressiveFunction'
export { createTraceGenerator } from './generators/trace'
export { createOHLCGenerator } from './generators/OHLC'
export { createDeltaFunctionGenerator } from './generators/deltaFunction'
// export { WhiteNoiseGenerator } from './generators/whiteNoise'
export { createSampledDataGenerator } from './generators/sampledData'

export { Stream } from './stream'
export { DataGenerator } from './dataGenerator'
export { DataHost } from './dataHost'
