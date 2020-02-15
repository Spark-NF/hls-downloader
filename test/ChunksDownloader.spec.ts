import * as fs from "fs";
import * as http from "../src/http";
import * as tempy from "tempy";
import { ChunksDownloader } from "../src/ChunksDownloader";

const PLAYLIST_URL = "https://test.com/playlist.m3u8"

const PLAYLIST_1 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:1101811
#EXTINF:1
segment1
#EXTINF:1
segment2`;
const PLAYLIST_2 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:1101811
#EXTINF:1
segment2
#EXTINF:1
segment3`;
const PLAYLIST_3 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:1101811
#EXTINF:1
segment3`;

jest.mock("../src/http", () => ({
    get: jest.fn(),
    download: jest.fn(),
}));

describe("ChunksDownloader", () => {
    it("Works properly", async () => {
        console.log = jest.fn();

        const playlist = [PLAYLIST_1, PLAYLIST_2, PLAYLIST_3];
        let currentPlaylist = 0;
        (http.get as jest.Mock).mockImplementation(() => {
            const ret = playlist[currentPlaylist];
            currentPlaylist = Math.min(playlist.length - 1, currentPlaylist + 1);
            return ret;
        });
        (http.download as jest.Mock).mockImplementation((url: string, file: string) => {
            fs.writeFileSync(file, url + "\n");
        })

        const dir = tempy.directory();
        const downloader = new ChunksDownloader(PLAYLIST_URL, 1, 5, dir, 0.1, 0.05);
        await downloader.start();

        const files = fs.readdirSync(dir);
        expect(files).toEqual(["segment1", "segment2", "segment3"]);
    });
});
