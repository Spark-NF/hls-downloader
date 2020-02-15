import * as fs from "fs";
import * as tempy from "tempy";
import { mergeFiles } from "../src/stream";

describe("mergeFiles", () => {
    it("Should work even if no files are provided", async () => {
        const output = tempy.file();
        await mergeFiles([], output);

        expect(fs.readFileSync(output).toString()).toBe("");
    });

    it("Should copy the file if only one file is provided", async () => {
        const input = tempy.file();
        fs.writeFileSync(input, "test");

        const output = tempy.file();
        await mergeFiles([input], output);

        expect(fs.readFileSync(output).toString()).toBe("test");
    });

    it("Should properly merge two files into one", async () => {
        const input1 = tempy.file();
        fs.writeFileSync(input1, "one");
        const input2 = tempy.file();
        fs.writeFileSync(input2, "two");

        const output = tempy.file();
        await mergeFiles([input1, input2], output);

        expect(fs.readFileSync(output).toString()).toBe("onetwo");
    });
});
