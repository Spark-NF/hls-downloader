import { URL } from "url";
import { ChunksDownloader } from "./ChunksDownloader";
import { HttpHeaders } from "./http";

export class ChunksLiveDownloader extends ChunksDownloader {
    private lastSegment?: string;

    private timeoutHandle?: NodeJS.Timeout;
    private refreshHandle?: NodeJS.Timeout;

    constructor(
        playlistUrl: string,
        concurrency: number,
        private fromEnd: number,
        segmentDirectory: string,
        private timeoutDuration: number = 60,
        private playlistRefreshInterval: number = 5,
        httpHeaders?: HttpHeaders,
    ) {
        super(playlistUrl, concurrency, segmentDirectory, httpHeaders);
    }

    protected async refreshPlayList(): Promise<void> {
        const playlist = await this.loadPlaylist();

        const interval = playlist.targetDuration || this.playlistRefreshInterval;
        const segments = playlist.segments!.map((s) => new URL(s.uri, this.playlistUrl).href);

        this.refreshHandle = setTimeout(() => this.refreshPlayList(), interval * 1000);

        let toLoad: string[] = [];
        if (!this.lastSegment) {
            toLoad = segments.slice(segments.length - this.fromEnd);
        } else {
            const index = segments.indexOf(this.lastSegment);
            if (index < 0) {
                console.error("Could not find last segment in playlist");
                toLoad = segments;
            } else if (index === segments.length - 1) {
                console.log("No new segments since last check");
                return;
            } else {
                toLoad = segments.slice(index + 1);
            }
        }

        this.lastSegment = toLoad[toLoad.length - 1];
        for (const uri of toLoad) {
            console.log("Queued:", uri);
            this.queue.add(() => this.downloadSegment(uri));
        }

        // Timeout after X seconds without new segment
        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
        }
        this.timeoutHandle = setTimeout(() => this.timeout(), this.timeoutDuration * 1000);
    }

    private timeout(): void {
        console.log("No new segment for a while, stopping");
        if (this.refreshHandle) {
            clearTimeout(this.refreshHandle);
        }
        this.resolve!();
    }
}
