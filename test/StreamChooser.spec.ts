import * as http from "../src/http";
import { StreamChooser } from "../src/StreamChooser";

const M3U8_MASTER = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=270000,AVERAGE-BANDWIDTH=195000,CODECS="avc1.42e01e,mp4a.40.2"
http://URL1
#EXT-X-STREAM-INF:BANDWIDTH=720000,AVERAGE-BANDWIDTH=520000,CODECS="avc1.4d401e,mp4a.40.2"
http://URL2
#EXT-X-STREAM-INF:BANDWIDTH=2160000,AVERAGE-BANDWIDTH=1560000,CODECS="avc1.640029,mp4a.40.2"
http://URL3
#EXT-X-STREAM-INF:BANDWIDTH=5400000,AVERAGE-BANDWIDTH=3600000,CODECS="avc1.640029,mp4a.40.2"
http://URL4`;

const M3U8_PLAYLIST = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:1
#EXT-X-MEDIA-SEQUENCE:1101811
#EXTINF:1
http://segment1
#EXTINF:1
http://segment2`;

jest.mock("../src/http", () => ({
    get: jest.fn(),
}));

describe("StreamChooser", () => {
    function setUpGet(src?: string) {
        (http.get as any).mockResolvedValue(src);
    }

    it("The constructor shouldn't do anything", () => {
        setUpGet();
        const stream = new StreamChooser("url");

        expect(http.get).not.toBeCalled();
    });

    it("Load should make an HTTP call to the stream", async () => {
        setUpGet();

        const stream = new StreamChooser("url");
        await stream.load();

        expect(http.get).toBeCalledWith("url");
    });

    it("Fail on invalid playlists", async () => {
        setUpGet("");
        const stream = new StreamChooser("url");

        expect(await stream.load()).toBe(false);
    });

    it("Return the url directly for playlists", async () => {
        setUpGet(M3U8_PLAYLIST);
        const stream = new StreamChooser("url");

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(false);
        expect(stream.getPlaylistUrl("best")).toBe("url");
    });

    it("Return the best playlist for master", async () => {
        setUpGet(M3U8_MASTER);
        const stream = new StreamChooser("url");

        expect(await stream.load()).toBe(true);
        expect(stream.isMaster()).toBe(true);
        expect(stream.getPlaylistUrl("best")).toBe("http://URL4");
    });
});
