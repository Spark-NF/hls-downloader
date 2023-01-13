import { HttpHeaders } from "./http";
import { ILogger } from "./Logger";

export interface IConfig {
    mergeUsingFfmpeg?: boolean;
    ffmpegPath?: string;
    concurrency?: number;
    live?: boolean;
    fromEnd?: number;
    maxRetries?: number;
    quality?: "worst" | "best" | number;
    streamUrl: string;
    segmentsDir?: string;
    mergedSegmentsFile?: string;
    outputFile: string;
    httpHeaders?: HttpHeaders;
    logger?: ILogger | ((...params: any) => void) | null;
}
