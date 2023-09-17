import * as fs from "fs";
import axios from "axios";

export type HttpHeaders = { [name: string]: string };

export async function get(url: string, headers?: HttpHeaders): Promise<string> {
    try {
        const response = await axios.get(url, { responseType: "text", headers });
        return response.data;
    } catch (error) {
        console.log(error);

        console.log("retrying... axios get");
        return get(url, headers);
    }
}

export async function download(
    url: string,
    file: string,
    headers?: HttpHeaders
): Promise<void> {
    try {
        const response = await axios(url, { responseType: "stream", headers });

        const writer = fs.createWriteStream(file);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } catch (err: any) {
        console.log(err.message);

        throw new Error("Network response was not ok");
    }
}

// export async function download(
//   url: string,
//   file: string,
//   headers?: HttpHeaders
// ): Promise<void> {
//   const response = await fetch(url);
//   if (!response.ok) {
//     throw new Error("Network response was not ok");
//   }
// //   const data = await response.arrayBuffer(); // Use response.buffer() if the data is binary (e.g., images)
//   // Write the data to a file
// //   const buffer = Buffer.from(arrayBuffer);
//   try {
//     fs.writeFileSync(file, buffer);
//     console.log("Data fetched and saved successfully!");
//   } catch (err: any) {
//     console.error("Error writing to file:", err);
//   }
// }
