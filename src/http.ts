import * as fs from "fs";
import axios from "axios";

export type HttpHeaders = { [name: string]: string };

export async function get(url: string, headers?: HttpHeaders): Promise<string> {
    const response = await axios.get(url, { responseType: "text", headers });
    return response.data;
}

export async function download(url: string, file: string, headers?: HttpHeaders, httpsAgent?: any): Promise<void> {
    const response = await axios(url, { responseType: "stream", headers, httpsAgent});
    const stream = response.data.pipe(fs.createWriteStream(file));
    return new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });
}
