import * as http from "../src/http";
import { StreamChooser } from "../src/StreamChooser";

const MASTER_URL = "https://github.com/Spark-NF/hls-downloader"

const M3U8_MASTER = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=270000,AVERAGE-BANDWIDTH=195000,CODECS="avc1.42e01e,mp4a.40.2"
playlist/URL1
#EXT-X-STREAM-INF:BANDWIDTH=720000,AVERAGE-BANDWIDTH=520000,CODECS="avc1.4d401e,mp4a.40.2"
playlist/URL2
#EXT-X-STREAM-INF:BANDWIDTH=2160000,AVERAGE-BANDWIDTH=1560000,CODECS="avc1.640029,mp4a.40.2"
playlist/URL3
#EXT-X-STREAM-INF:BANDWIDTH=5400000,AVERAGE-BANDWIDTH=3600000,CODECS="avc1.640029,mp4a.40.2"
playlist/URL4`;

const M3U8_PLAYLIST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:1
#EXT-X-MEDIA-SEQUENCE:1101811
#EXTINF:1
segment/segment1
#EXTINF:1
segment/segment2`;

jest.mock("../src/http", () => ({
    get: jest.fn(),
}));

describe("StreamChooser", () => {
    function setUpGet(src?: string): void {
        (http.get as any).mockResolvedValue(src);
    }

    it("The constructor shouldn't do anything", () => {
        setUpGet();
        new StreamChooser(MASTER_URL);

        expect(http.get).not.toBeCalled();
    });

    it("Throws when not loaded first", async () => {
        const stream = new StreamChooser(MASTER_URL);

        expect(() => stream.isMaster()).toThrow("You need to call 'load' before 'isMaster'");
        expect(() => stream.getPlaylistUrl()).toThrow("You need to call 'load' before 'getPlaylistUrl'");
    });

    it("Load should make an HTTP call to the stream", async () => {
        setUpGet();

        const stream = new StreamChooser(MASTER_URL);
        await stream.load();

        expect(http.get).toBeCalledWith(MASTER_URL);
    });

    it("Fail on invalid playlists", async () => {
        setUpGet("");
        const stream = new StreamChooser(MASTER_URL);

        expect(await stream.load()).toBe(false);
    });

    it("Return the url directly for playlists", async () => {
        setUpGet(M3U8_PLAYLIST);
        const stream = new StreamChooser(MASTER_URL);

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(false);
        expect(stream.getPlaylistUrl("best")).toBe(MASTER_URL);
    });

    it("Return the best playlist for master", async () => {
        setUpGet(M3U8_MASTER);
        const stream = new StreamChooser(MASTER_URL);

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(true);
        expect(stream.getPlaylistUrl("best")).toBe("https://github.com/Spark-NF/playlist/URL4");
    });

    it("Returns the worst playlist for master", async () => {
        setUpGet(M3U8_MASTER);
        const stream = new StreamChooser(MASTER_URL);

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(true);
        expect(stream.getPlaylistUrl("worst")).toBe("https://github.com/Spark-NF/playlist/URL1");
    });

    it("Returns the best playlist for master under a given bandwidth", async () => {
        setUpGet(M3U8_MASTER);
        const stream = new StreamChooser(MASTER_URL);

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(true);
        expect(stream.getPlaylistUrl(1000000)).toBe("https://github.com/Spark-NF/playlist/URL2");
    });

    it("Fails for master if no quality is provided", async () => {
        console.error = jest.fn();

        setUpGet(M3U8_MASTER);
        const stream = new StreamChooser(MASTER_URL);

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(true);
        expect(stream.getPlaylistUrl()).toBe(false);
        expect(console.error).toBeCalledWith("You need to provide a quality with a master playlist");
    });
});
