import * as fs from "fs";
import * as tempy from "tempy";
import * as http from "http";
import { download, get } from "../src/http";

const URL = "http://localhost:8080/test";

function listenerOk(res: http.ServerResponse): void {
    res.writeHead(200);
    res.write("test");
    res.end();
}
function listenerError(res: http.ServerResponse): void {
    res.writeHead(404);
    res.end();
}

describe("http", () => {
    let server: http.Server;
    let listener: (res: http.ServerResponse) => void;

    function httpListener(req: http.IncomingMessage, res: http.ServerResponse): void {
        listener(res);
    }
    beforeAll(() => {
        server = http.createServer(httpListener);
        server.listen(8080);
    })
    afterAll(() => {
        server.close();
    });

    describe("get", () => {
        it("Should succeed on 200", async () => {
            listener = listenerOk;

            const response = await get(URL);
            expect(response).toEqual("test");
        });

        it("Should fail on 404", async () => {
            listener = listenerError;

            await expect(get(URL)).rejects.toThrow();
        });
    });

    describe("download", () => {
        it("Should succeed on 200", async () => {
            listener = listenerOk;

            const output = tempy.file();
            await download(URL, output)

            expect(fs.readFileSync(output).toString()).toBe("test");
        });

        it("Should fail on 404", async () => {
            listener = listenerError;

            const output = tempy.file();
            await expect(download(URL, output)).rejects.toThrow();
        });
    });
});
