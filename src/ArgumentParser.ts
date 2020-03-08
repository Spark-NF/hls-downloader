import * as commander from "commander";
import * as packageJson from "../package.json";
import { IConfig } from "./Config.js";
import { HttpHeaders } from "./http.js";

function parseHeaders(value: string, previous: HttpHeaders): HttpHeaders {
    const pos = value.indexOf(":");
    if (pos > 0) {
        const key = value.substr(0, pos).trim();
        previous[key] = value.substr(pos + 1).trim();
    }
    return previous;
}

export class ArgumentParser {
    public parse(argv: string[]): IConfig | false {
        const args = new commander.Command();

        // Setup
        args
            .version(packageJson.version)
            .usage("[options] <url>")
            .option("--ffmpeg-merge", "Merge TS segments using FFMPEG", false)
            .option("--segments-dir [dir]", "Where the TS segments will be stored")
            .option("--merged-segments-file [file]", "Location of the merged TS segments file")
            .option("-c, --concurrency [threads]", "How many threads to use for segments download", parseInt, 1)
            .option("-q, --quality [quality]", "Stream quality when possible (worst, best, or max bandwidth)", "best")
            .option("-o, --output-file [file]", "Target file to download the stream to")
            .option("-h, --header [header]", "Header to pass to the HTTP requests", parseHeaders, {})
            .parse(argv);

        // Varlidate a few arguments
        if (args.args.length !== 1) {
            console.error("You must provide exactly one URL");
            return false;
        }
        if (args.quality && !["worst", "best"].includes(args.quality) && !parseInt(args.quality, 10)) {
            console.error("Invalid quality provided:", args.quality);
            return false;
        }
        if (!args.outputFile) {
            console.error("You must provide an output file");
            return false;
        }

        // Read arguments to variables
        return {
            concurrency: args.concurrency,
            fromEnd: args.fromEnd,
            mergeUsingFfmpeg: args.ffmpegMerge,
            mergedSegmentsFile: args.mergedSegmentsFile,
            outputFile: args.outputFile,
            quality: args.quality,
            segmentsDir: args.segmentsDir,
            streamUrl: args.args[0],
            httpHeaders: args.header,
        };
    }
}
