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
    for (const file of files) {
        await copyToStream(file, outStream);
    }
    outStream.end();
}