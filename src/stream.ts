import * as fs from "fs";

function copyToStream(inFile: string, outStream: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
        fs
            .createReadStream(inFile)
            .on("error", reject)
            .on("end", resolve)
            .pipe(outStream, { end: false });
    });
}

export async function mergeFiles(files: string[], outputFile: string): Promise<void> {
    const outStream = fs.createWriteStream(outputFile);
    const ret = new Promise<void>((resolve, reject) => {
        outStream.on("finish", resolve);
        outStream.on("error", reject);
    });
    for (const file of files) {
        await copyToStream(file, outStream);
    }
    outStream.end();
    return ret;
}