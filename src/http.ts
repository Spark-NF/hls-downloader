import * as fs from "fs";
import * as request from "request";

export function get(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        request.get(url, (error: string, response: any, body: string) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

export function download(url: string, file: string): Promise<void> {
    return new Promise((resolve, reject) => {
        request
            .get(url)
            .on("error", reject)
            .pipe(fs.createWriteStream(file))
            .on("finish", resolve);
    });
}
