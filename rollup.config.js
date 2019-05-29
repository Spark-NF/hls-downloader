import json from "rollup-plugin-json"
import tslint from "rollup-plugin-tslint";
import typescript from "rollup-plugin-typescript2"
import packageJson from "./package.json"

const makeConfig = (inputFile, outputFile, external, runnable) => ({
    input: inputFile,
    output: {
        file: outputFile,
        format: "cjs",
        banner: runnable ? "#!/usr/bin/env node" : undefined,
    },
    external: [
        ...external,
        ...["child_process", "fs", "os", "path"],
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
    ],
    plugins: [
        json(),
        tslint({
            throwOnError: true,
            exclude: "*.json",
        }),
        typescript({
            typescript: require("typescript"),
        }),
    ],
});

export default [
    makeConfig("src/index.ts", packageJson.main, [], false),
    makeConfig("src/cli.ts", packageJson.bin["hls-downloader"], ["./index"], true),
];
