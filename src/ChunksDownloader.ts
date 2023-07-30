import * as m3u8 from "m3u8-parser";
import PQueue from "p-queue";
import * as path from "path";
import { download, get, HttpHeaders } from "./http";
import { ILogger } from "./Logger";

export abstract class ChunksDownloader {
    protected queue: PQueue;

    protected resolve?: () => void;
    protected reject?: () => void;

    constructor(
        protected logger: ILogger,
        protected playlistUrl: string,
        protected concurrency: number,
        protected maxRetries: number,
        protected segmentDirectory: string,
        protected httpHeaders?: HttpHeaders,
    ) {
        this.queue = new PQueue({
            concurrency: this.concurrency,
        });
    }

    public start(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;

            this.queue.add(() => this.refreshPlayList());
        });
    }

    protected abstract refreshPlayList(): Promise<void>;

    protected async loadPlaylist(): Promise<m3u8.Manifest> {
        const response = await get(this.playlistUrl, this.httpHeaders);

        const parser = new m3u8.Parser();
        parser.push(response);
        parser.end();

        return parser.manifest;
    }

    protected async downloadSegment(segmentUrl: string): Promise<void> {
        // Get filename from URL
        const question = segmentUrl.indexOf("?");
        let filename = question > 0 ? segmentUrl.substr(0, question) : segmentUrl;
        const slash = filename.lastIndexOf("/");
        filename = filename.substr(slash + 1);

        // Download file
        await this.downloadWithRetries(segmentUrl, path.join(this.segmentDirectory, filename), this.maxRetries);
        this.logger.log("Received:", segmentUrl);
    }

    private async downloadWithRetries(url: string, file: string, maxRetries: number, currentTry = 1): Promise<void> {
        if (currentTry > maxRetries) {
            throw new Error('too many retries - download failed')
        }

        try {
            await download(url, file, this.httpHeaders);
        } catch (err: any) {
            this.logger.log("Timoout:", err.message);
            this.downloadWithRetries(url, file, maxRetries, currentTry);
        }
    }
}
