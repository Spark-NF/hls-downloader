import json from "@rollup/plugin-json"
import { eslint } from "rollup-plugin-eslint";
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
        ...["child_process", "fs", "os", "path", "url"],
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.peerDependencies || {}),
    ],
    plugins: [
        json(),
        eslint({
            throwOnError: true,
            throwOnWarning: true,
            exclude: [
                "node_modules/**",
                "*.json",
            ],
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
