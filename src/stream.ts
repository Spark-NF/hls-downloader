import * as fs from "fs";

function copyToStream(inFile: string, outStream: fs.WriteStream): Promise<void> {
    return new Promise((resolve, reject) => {
        try {
            fs
                .createReadStream(inFile)
                .on("error", reject)
                .on("end", resolve)
                .pipe(outStream, { end: false });
        } catch (e) {
            console.log("Error in copyToStream: " + e);
            reject(e);
        }
    });
}

export async function mergeFiles(files: string[], outputFile: string): Promise<void> {
    const outStream = fs.createWriteStream(outputFile);
    const ret = new Promise<void>((resolve, reject) => {
        try {
            outStream.on("finish", resolve);
            outStream.on("error", reject);
        } catch (e) {
            console.log("amir");
            console.log("Error in mergeFiles: " + e);
            reject(e);
        }
    });
    for (const file of files) {
        await copyToStream(file, outStream);
    }
    outStream.end();
    return ret;
}