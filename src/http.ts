import * as fs from "fs";
import axios from "axios";

export async function get(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: "text" });
    return response.data;
}

export async function download(url: string, file: string): Promise<void> {
    const response = await axios(url, { responseType: "stream" });
    const stream = response.data.pipe(fs.createWriteStream(file));
    return new Promise((resolve, reject) => {
        stream.on("finish", resolve);
        stream.on("error", reject);
    });
}
