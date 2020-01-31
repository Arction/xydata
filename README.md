# XYData generator library

A data generator library.

The generator is used to generate data for LightningChart<sup>&#174;</sup> JS charting library. [https://www.arction.com/](https://www.arction.com/)

## Installation

`npm install --save @arction/xydata`

## Documentation

Online documentation is available at [arction.github.io/xydata](https://arction.github.io/xydata/)

## Getting started

```ts
import { createProgressiveRandomGenerator } from '@arction/xydata'

// create new instance of progressive random generator
createProgressiveRandomGenerator()
    // define that 1000 points should be generated
    .setNumberOfPoints(1000)
    // generate those 1000 points
    .generate()
    // set stream to progress every 250 milliseconds
    .setStreamInterval(250)
    // set stream to output 10 points at a time
    .setStreamBatchSize(10)
    // make the stream infinite
    .setStreamRepeat(true)
    // create a new stream with previously defined stream settings
    .toStream()
    // every time the stream outputs data, run this function on each of the data points
    .forEach(data=>{
        console.log(data)
    })
```

This creates a basic progressive random generator and uses the Stream API to output the data to console.

> Note: You should newer create a new instance of any generator using the `new` keyword. Generators should only be created with the `create...` functions.

When calling `.generate()` on any data generator a new instance of a 'DataHost' is returned. The `.generate()` function can be called multiple times to get a new set of data with same settings as before but different values each time.

### Creating multiple data sets

You can call `.generate()` function multiple times to get new sets of data.

```ts
import { createTraceGenerator } from '@arction/xydata'

const generator = createTraceGenerator()

const dataSet1 = generator.generate()
const dataSet2 = generator.generate()
```

This would give you two different data sets that have been generated based on same settings but which will have different values.

### Changing generator settings

When a data generator is created it has some default settings based on which generator it is. To change any of these settings call `.set....` function that will create a new data generator with that setting changed. You can't change multiple settings with a single call or change settings of a generator that has been created previously. A change in settings will always result in a new generator.

 ```ts
import { createTraceGenerator } from '@arction/xydata'

const generator = createTraceGenerator()
    .setNumberOfPoints( 10 )

const derivedGenerator = generator.setNumberOfPoints( 20 )

const dataSet1 = derivedGenerator.generate()

const dataSet2 = generator.generate()
```

This would create two data sets with different values and settings. `dataSet1` would have 20 data points and `dataSet2` would have 10.

### Data streams

The data sets have possibility to output the data as a stream of data. These streams can be used to alter the data in multiple steps.

 ```ts
import { createTraceGenerator } from '@arction/xydata'

createTraceGenerator()
    .setNumberOfPoints( 10 )
    .generate()
    .toStream()
    .map( value => ( { x:value.x, y: value.y * 2 } ) )
    .forEach( value => console.log(value) )
```

This code would create a data generator and then stream that data through two functions, map and forEach. 
The map function alters the data by multiplying the y value by 2 and then streams it to the forEach function.
The forEach function would log each invidual point to console.

The settings for the stream are set by the Data Host that is returned from the `.generate()` function. The stream settings can't be changed
after the stream has been generated.

## Generators

| Generator | Description |
|-----------|-------------|
| Delta Function | Generate mostly flat data with random spikes. |
| OHLC | Generate Open, High, Low, Close data. |
| Parametric Function | Sample user defined X and Y functions for each t step. |
| Progressive Function | Sample a user defined function with given X step. |
| Progressive Random | Generate random progressive data that has progessive X step. |
| Progressive Trace | Generate random trace data from previous point that has progressive X step. |
| Sample Data | Sample given array with specified frequency and user defined step. |
| Trace | Generate random trace data that can go to any direction on the XY coordinates. |
| White Noise | Generate white noise. |

## Development instructions

The project is developed using TypeScript. Build system of the project heavily relies on Node.js. Dependencies are managed with *npm*, therefore, remember to run **npm install** before starting of anything else. 

The project uses RollUp for creating the distributable library files.

There are several *npm scripts*, which are used in development process:

| Name     | Command          | Description              |
| ---------|------------------|--------------------------|
| test     | npm test         | run tests and watch      |
| lint     | npm run lint     | run static analyzer and watch
| ci:test  | npm run ci:test  | run tests once
| ci:lint  | npm run ci:lint  | run static analyzer once
| ci:watch | npm run ci:watch | run CI circle and watch
| build    | npm run build    | build the library
| build:watch| npm run build:watch | build the library and watch
| docs     | npm run docs     | build documentation
