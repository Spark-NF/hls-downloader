import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import { ChunksLiveDownloader } from "./ChunksLiveDownloader";
import { ChunksStaticDownloader } from "./ChunksStaticDownloader";
import { IConfig as IIConfig } from "./Config";
import { mergeChunks as mergeChunksFfmpeg, transmuxTsToMp4 } from "./ffmpeg";
import { mergeFiles as mergeChunksStream } from "./stream";
import { StreamChooser } from "./StreamChooser.js";

export type IConfig = IIConfig;

export async function download(config: IConfig): Promise<void> {
    // Temporary files
    const runId = Date.now();
    const mergedSegmentsFile = config.mergedSegmentsFile || os.tmpdir() + "/hls-downloader/" + runId + ".ts";
    const segmentsDir = config.segmentsDir || os.tmpdir() + "/hls-downloader/" + runId + "/";

    // Create target directory
    fs.mkdirpSync(path.dirname(mergedSegmentsFile));
    fs.mkdirpSync(segmentsDir);

    // Choose proper stream
    const streamChooser = new StreamChooser(config.streamUrl, config.httpHeaders);
    if (!await streamChooser.load()) {
        return;
    }
    const playlistUrl = streamChooser.getPlaylistUrl(config.quality);
    if (!playlistUrl) {
        return;
    }

    // Start download
    const chunksDownloader = config.live
        ? new ChunksLiveDownloader(
            playlistUrl,
            config.concurrency || 1,
            config.fromEnd || 9999,
            segmentsDir,
            undefined,
            undefined,
            config.httpHeaders,
        ) :  new ChunksStaticDownloader(
            playlistUrl,
            config.concurrency || 1,
            segmentsDir,
            config.httpHeaders,
        );
    await chunksDownloader.start();

    // Get all segments
    const segments = fs.readdirSync(segmentsDir).map((f) => segmentsDir + f);
    segments.sort((a: string, b: string) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    });

    // Merge TS files
    const mergeFunction = config.mergeUsingFfmpeg ? mergeChunksFfmpeg : mergeChunksStream;
    await mergeFunction(segments, mergedSegmentsFile);

    // Transmux
    await transmuxTsToMp4(mergedSegmentsFile, config.outputFile);

    // Delete temporary files
    fs.remove(segmentsDir);
    fs.remove(mergedSegmentsFile);
}
