import * as fs from "fs";
import * as http from "../src/http";
import * as tempy from "tempy";
import { ChunksStaticDownloader } from "../src/ChunksStaticDownloader";

const PLAYLIST_URL = "https://test.com/playlist.m3u8"

const PLAYLIST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MEDIA-SEQUENCE:1101811
#EXTINF:1
segment1
#EXTINF:1
segment2
#EXTINF:1
segment3`;

jest.mock("../src/http", () => ({
    download: jest.fn(),
    get: jest.fn(),
}));

describe("ChunksStaticDownloader", () => {
    it("Works properly", async () => {
        const logger = { log: jest.fn(), error: jest.fn() };

        (http.get as jest.Mock).mockReturnValue(PLAYLIST);
        (http.download as jest.Mock).mockImplementation((url: string, file: string) => {
            fs.writeFileSync(file, url + "\n");
        });

        const dir = tempy.directory();
        const downloader = new ChunksStaticDownloader(logger, PLAYLIST_URL, 1, 1, dir);
        await downloader.start();

        const files = fs.readdirSync(dir);
        expect(files).toEqual(["segment1", "segment2", "segment3"]);
    });
});
