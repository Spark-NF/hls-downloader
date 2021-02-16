import { URL } from "url";
import { ChunksDownloader } from "./ChunksDownloader";
import { HttpHeaders } from "./http";

export class ChunksStaticDownloader extends ChunksDownloader {
    constructor(
        playlistUrl: string,
        concurrency: number,
        segmentDirectory: string,
        httpHeaders?: HttpHeaders,
    ) {
        super(playlistUrl, concurrency, segmentDirectory, httpHeaders);
    }

    protected async refreshPlayList(): Promise<void> {
        const playlist = await this.loadPlaylist();
        const segments = playlist.segments!.map((s) => new URL(s.uri, this.playlistUrl).href);

        console.log(`Queueing ${segments.length} segment(s)`);
        for (const uri of segments) {
            this.queue.add(() => this.downloadSegment(uri));
        }

        this.queue.onIdle().then(() => this.finished());
    }

    private finished(): void {
        console.log("All segments received, stopping");
        this.resolve!();
    }
}
