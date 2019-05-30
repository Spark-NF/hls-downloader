<h1 align="center">HLS downloader</h1>

[![NPM version](https://img.shields.io/npm/v/node-hls-downloader.svg)](https://www.npmjs.com/package/node-hls-downloader)
[![Build Status](https://travis-ci.org/Spark-NF/hls-downloader.svg?branch=master)](https://travis-ci.org/Spark-NF/hls-downloader)
[![Code Coverage](https://img.shields.io/codecov/c/github/Spark-NF/hls-downloader.svg)](https://codecov.io/gh/Spark-NF/hls-downloader)
[![Project license](https://img.shields.io/github/license/Spark-NF/hls-downloader.svg)](https://raw.githubusercontent.com/Spark-NF/hls-downloader/master/LICENSE)

## About
Downloads a live HLS stream.

## Usage
### CLI
```
hls-downloader [-V] [-h] [-q QUALITY] -o FILE stream_url
```

#### Example
```
hls-downloader -q best -c 5 -o video.mp4 "https://......./stream.m3u8"
```

### API
```js
import { download } from "node-hls-downloader";

await download({
    quality: "best",
    concurrency: 5,
    outputFile: "video.mp4",
    streamUrl: "https://......./stream.m3u8",
});
```

### Options
_Note: options marked with 🔒 are mandatory._

#### `stream_url`, `streamUrl` 🔒
The URL to the stream (either the master file or a playlist).

#### `--ffmpeg-merge`, `mergeUsingFfmpeg`
Merge TS segments using FFMPEG instead of basic concatenation.
Not recommended, but you can use it if stuttering issues occur when merging the TS segments.

* Default: `false`

#### `--segments-dir`, `segmentsDir`
Where the TS segments will be stored.

* Default: a temporary directory

#### `--merged-segments-file`, `mergedSegmentsFile`
Location of the merged TS segments file.

* Default: a temporary file

#### `-c`, `--concurrency`, `concurrency`
How many threads to use for downloading segments.

* Default: `1`

#### `-q`, `--quality`, `quality` 🔒*
Stream quality: `worst`, `best`, or max bandwidth.

_* only mandatory if passing a master playlist stream URL_

#### `-o`, `--output-file`, `outputFile` 🔒
Target file to download the stream to.
If it already exists, it will be overwritten.

## Authors
* [Spark-NF](https://github.com/Spark-NF)

## License
The program is licensed under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).