# MMM-Bubi

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) to display the number of available bikes on a particular station of the Budapest public bike system (aka MOL Bubi).

## Features

By default this module displays the number of available bikes and the official name of the specified station:

![](https://raw.githubusercontent.com/balassy/MMM-Bubi/master/doc/screenshot-default.png)

You can configure the module to display a custom (typically shorter) name for the station:

![](https://raw.githubusercontent.com/balassy/MMM-Bubi/master/doc/screenshot-custom-place-name.png)

If you wish, you can completely remove the station name:

![](https://raw.githubusercontent.com/balassy/MMM-Bubi/master/doc/screenshot-no-place-name.png)

This module is capable to display the bike availability only for a single station. If you would like to see the number of bikes for multiple stations, add this module multiple times.

For updates, please check the [CHANGELOG](https://github.com/balassy/MMM-Bubi/blob/master/CHANGELOG.md).

## Using the module

To use this module follow these steps:

1. Clone this repository to the `modules` folder of your MagicMirror:

```bash
git clone https://github.com/balassy/MMM-Bubi.git
```

2. Add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-Bubi',
      position: 'top_right',
      config: {
        updateInterval: 600000, // 10 minutes in milliseconds
        placeId: 248398,
        showPlaceName: true,
        placeName: ''
      }
    }
  ]
}
```

## Configuration options

Coming soon...

## How it works

This module periodically sends requests from the browser window of the MagicMirror Electron application to the public [NextBike API](https://bubi.nextbike.net/maps/nextbike-live.json?&domains=mb). The NextBike API is free, and it does NOT require any login or API key.

You can see an XML example by visiting this URL: https://bubi.nextbike.net/maps/nextbike-live.xml?&domains=mb

## Contribution

Although for operation this module does not depend on any other module, if you would like to contribute to the codebase, please use the preconfigured linters to analyze the source code before sending a pull request. To run the linters follow these steps:

1. Install developer dependencies:

```bash
npm install
```

2. Install Grunt:

```bash
npm install -g grunt
```

3. Use Grunt to run all linters:

```bash
grunt
```

## Got feedback?

Your feedback is more than welcome, please send your suggestions, feature requests or bug reports as [Github issues](https://github.com/balassy/MMM-Bubi/issues).

## Acknowledments

Many thanks to [Michael Teeuw](https://github.com/MichMich) for creating and maintaining the [MagicMirror²](https://github.com/MichMich/MagicMirror/) project fully open source.

## About the author

This project is created and maintaned by [György Balássy](https://www.linkedin.com/in/balassy).
