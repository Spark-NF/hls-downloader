import { URL } from "url";
import { ChunksDownloader } from "./ChunksDownloader";
import { HttpHeaders } from "./http";
import { ILogger } from "./Logger";

export class ChunksStaticDownloader extends ChunksDownloader {
    constructor(
        logger: ILogger,
        playlistUrl: string,
        concurrency: number,
        private maxRetries: number,
        segmentDirectory: string,
        httpHeaders?: HttpHeaders,
    ) {
        super(logger, playlistUrl, concurrency, segmentDirectory, httpHeaders);
    }

    protected async refreshPlayList(): Promise<void> {
        const playlist = await this.loadPlaylist();
        const segments = playlist.segments!.map((s) => new URL(s.uri, this.playlistUrl).href);

        this.logger.log(`Queueing ${segments.length} segment(s)`);
        for (const uri of segments) {
            this.queue.add(() => this.downloadSegment(uri, this.maxRetries, 1));
        }

        this.queue.onIdle().then(() => this.finished());
    }

    private finished(): void {
        this.logger.log("All segments received, stopping");
        this.resolve!();
    }
}
