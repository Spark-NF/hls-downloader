import { ArgumentParser } from "./ArgumentParser";
import { download } from "./index";

(async () => {
    // Parse CLI arguments
    const argumentParser = new ArgumentParser();
    const config = argumentParser.parse(process.argv);
    if (!config) {
        return;
    }

    // Start download
    await download(config);
})();
