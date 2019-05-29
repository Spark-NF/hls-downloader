declare module "m3u8-parser" {
    interface ManifestSegment {
        uri: string;
    }

    interface ManifestPlaylist {
        attributes: { [key: string]: string | number };
        uri: string;
        timeline: number;
    }

    interface Manifest {
        targetDuration?: number;
        segments?: ManifestSegment[];
        playlists?: ManifestPlaylist[];
    }

    export class Parser {
        push(str: string): void;
        end(): void;
        manifest: Manifest;
    }
}