jest.mock("child_process");
jest.mock("fs");

import * as cp from "child_process";
import { EventEmitter } from "events";
import * as fs from "fs";
import { spawnFfmpeg, mergeChunks, transmuxTsToMp4 } from "../src/ffmpeg";

describe("ffmpeg", () => {
    const logger = {
        error: jest.fn(),
        log: jest.fn(),
    };

    function setupSpawnMock(): cp.ChildProcess {
        const proc = new EventEmitter() as cp.ChildProcess;
        (proc as any).stdout = new EventEmitter();
        (proc as any).stderr = new EventEmitter();

        jest.spyOn(cp, "spawn").mockReturnValue(proc);
        return proc;
    }
    async function wrapFfmpeg(cb: () => Promise<any>): Promise<void> {
        const proc = setupSpawnMock();
        const promise = cb();
        proc.emit("close", 0);
        await promise;
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("spawnFfmpeg", () => {
        it("Should return a promise that resolves when the process closes", async () => {
            await wrapFfmpeg(() => spawnFfmpeg(logger, "my-ffmpeg", ["arg1", "arg2"]));

            expect(cp.spawn).toBeCalledWith("my-ffmpeg", ["arg1", "arg2"]);
        });

        it("Should forward all messages and output to the logger", async () => {
            const proc = setupSpawnMock();
            const promise = spawnFfmpeg(logger, "my-ffmpeg", ["arg1", "arg2"]);
            proc.emit("message", "some message");
            proc.stdout!.emit("data", "some stdout");
            proc.stderr!.emit("data", "some stderr");
            proc.emit("close", 0);
            await promise;

            expect(logger.log).toHaveBeenCalledTimes(4);
            expect(logger.log).toHaveBeenNthCalledWith(2, "ffmpeg message:", "some message");
            expect(logger.log).toHaveBeenNthCalledWith(3, "ffmpeg stdout: some stdout");
            expect(logger.log).toHaveBeenNthCalledWith(4, "ffmpeg stderr: some stderr");
        });

        it("Should throw if FFMPEG closes with an error", async () => {
            const proc = setupSpawnMock();
            const promise = spawnFfmpeg(logger, "my-ffmpeg", ["arg1", "arg2"]);
            proc.emit("close", 1);

            await expect(promise).rejects.toEqual("ffmpeg closed with status 1");
            expect(logger.error).toHaveBeenCalledWith("ffmpeg closed with status 1");
        });

        it("Should throw if the process has an error", async () => {
            const proc = setupSpawnMock();
            const promise = spawnFfmpeg(logger, "my-ffmpeg", ["arg1", "arg2"]);
            proc.emit("error", "some error");

            await expect(promise).rejects.toEqual("some error");
            expect(logger.error).toHaveBeenCalledWith("ffmpeg error:", "some error");
        });
    });

    describe("mergeChunks", () => {
        it("Should spawn a FFMPEG process with the correct parameters", async () => {
            await wrapFfmpeg(() => mergeChunks(logger, "my-ffmpeg", ["segment1", "segment2"], "output-file"));

            expect(cp.spawn).toHaveBeenCalledWith("my-ffmpeg", [
                "-y",
                "-loglevel", "warning",
                "-f", "concat",
                "-i", "ffmpeg-input.txt",
                "-c", "copy",
                "output-file",
            ]);
        });

        it("Should write the segments to the temporary segments file then delete it", async () => {
            await wrapFfmpeg(() => mergeChunks(logger, "my-ffmpeg", ["segment1", "segment2"], "output-file"));

            expect(fs.writeFileSync).toHaveBeenCalledWith("ffmpeg-input.txt", "file 'segment1'\nfile 'segment2'\n");
            expect(fs.unlinkSync).toHaveBeenCalledWith("ffmpeg-input.txt");
        });
    });

    describe("transmuxTsToMp4", () => {
        it("Should spawn a FFMPEG process with the correct parameters", async () => {
            await wrapFfmpeg(() => transmuxTsToMp4(logger, "my-ffmpeg", "input-file", "output-file"));

            expect(cp.spawn).toHaveBeenCalledWith("my-ffmpeg", [
                "-y",
                "-loglevel", "warning",
                "-i", "input-file",
                "-c", "copy",
                "-bsf:a", "aac_adtstoasc",
                "output-file",
            ]);
        });
    });
});
