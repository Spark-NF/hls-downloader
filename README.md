<h1 align="center">HLS downloader</h1>

[![Build Status](https://travis-ci.org/Spark-NF/hls-downloader.svg?branch=master)](https://travis-ci.org/Spark-NF/hls-downloader)
[![Code Coverage](https://img.shields.io/codecov/c/github/Spark-NF/hls-downloader.svg)](https://codecov.io/gh/Spark-NF/hls-downloader)
[![Project license](https://img.shields.io/github/license/Spark-NF/hls-downloader.svg)](https://raw.githubusercontent.com/Spark-NF/hls-downloader/master/LICENSE)

## About
Downloads a live HLS stream.

### Usage
```
hls-downloader [-V] [-h] [-q QUALITY] -o FILE stream_url
```

### Arguments
* `stream_url`: the URL to the stream (either the master file or a playlist)
* `--ffmpeg-merge`: merge TS segments using FFMPEG instead of basic concatenation (default: `false`)
* `--segments-dir DIR`: where the TS segments will be stored
* `--merged-segments-file FILE`: location of the merged TS segments file
* `-c THREADS`, `--concurrency THREADS`: how many threads to use for downloading segments (default: `1`)
* `-q QUALITY`, `--quality QUALITY`: stream quality when possible (`worst`, `best`, or max bandwidth), only used when using a master file
* `-o FILE`, `--output-file FILE`: target file to download the stream to

### Example
```
hls-downloader -q best -c 5 -o video.mp4 "https://......./stream.m3u8"
```

## Authors
* [Spark-NF](https://github.com/Spark-NF)

## License
The program is licensed under the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).