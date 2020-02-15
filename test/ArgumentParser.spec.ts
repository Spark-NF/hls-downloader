import { ArgumentParser } from "../src/ArgumentParser";
import { IConfig } from "../src/Config";

describe("ArgumentParser", () => {
    beforeEach(() => {
        console.error = jest.fn();
    });

    it("Should understand basic usage", () => {
        const parser = new ArgumentParser();
        const ret = parser.parse(["node", "test.js", "-o", "test.mp4", "http://test"]);

        expect(ret).not.toBeFalsy();

        const config = ret as IConfig;
        expect(config.outputFile).toEqual("test.mp4");
        expect(config.streamUrl).toEqual("http://test");
    });

    it("Should fail if no URL is passed", () => {
        const parser = new ArgumentParser();
        const ret = parser.parse(["node", "test.js", "http://test"]);

        expect(ret).toBe(false);
        expect(console.error).toBeCalledWith("You must provide an output file");
    });

    it("Should fail if no output file is passed", () => {
        const parser = new ArgumentParser();
        const ret = parser.parse(["node", "test.js"]);

        expect(ret).toBe(false);
        expect(console.error).toBeCalledWith("You must provide exactly one URL");
    });

    describe("Quality parsing", () => {
        it("Should understand string qualities", () => {
            const parser = new ArgumentParser();
            const ret = parser.parse(["node", "test.js", "-o", "test.mp4", "-q", "best", "http://test"]);

            expect(ret).not.toBeFalsy();

            const config = ret as IConfig;
            expect(config.quality).toBe("best");
        });

        it("Should understand number qualities", () => {
            const parser = new ArgumentParser();
            const ret = parser.parse(["node", "test.js", "-o", "test.mp4", "-q", "1600000", "http://test"]);

            expect(ret).not.toBeFalsy();

            const config = ret as IConfig;
            expect(config.quality).toBe("1600000");
        });

        it("Should fail for invalid values", () => {
            const parser = new ArgumentParser();
            const ret = parser.parse(["node", "test.js", "-o", "test.mp4", "-q", "test_failure", "http://test"]);

            expect(ret).toBeFalsy();
            expect(console.error).toBeCalledWith("Invalid quality provided:", "test_failure");
        });
    });
});
