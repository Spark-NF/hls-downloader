import { buildLogger } from "../src/Logger";

describe("buildLogger", () => {
    it("Should use the console by default", ()  => {
        expect(buildLogger(undefined)).toBe(console);
    });

    it("Should return a no-op logger when passed null", ()  => {
        const logger = buildLogger(null);

        expect(typeof logger.error).toBe("function");
        expect(typeof logger.log).toBe("function");
        expect(logger.error).toBe(logger.log);
    });

    it("Should provide a logger object when passed a function", () => {
        const input = (): void => { /* no-op */ };
        const logger = buildLogger(input);

        expect(logger.error).toBe(input);
        expect(logger.log).toBe(input);
    })

    it("Should use the passed logged when provided", () => {
        const input = {
            error(): void { /* no-op */ },
            log(): void { /* no-op */ },
        };
        expect(buildLogger(input)).toBe(input);
    })
});
