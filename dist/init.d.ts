/// <reference types="node" />
import { EventEmitter } from "events";
interface RecognizerEvents {
    whenReady: () => void;
    whenDone: () => void;
}
/**
 * Recognizer Class
 */
declare class Recognizer extends EventEmitter {
    /**THRESHOLD: number
     *
     * THRESHOLD = 250
     */
    THRESHOLD: number;
    /**LANGUAGE: string
     *
     * LANGUAGE = "en-US"
     *
     * CODES:
     *
     * "en"
     *
     * "es"
     *
     * "ja"
     *
     * "zh"
     *
     * etc
     */
    LANGUAGE: string;
    /**PRIORITY_FILTER: number
     *
     * PRIORITY_FILTER = 1
     */
    PRIORITY_FILTER: number;
    constructor();
    on<U extends keyof RecognizerEvents>(event: U, listener: RecognizerEvents[U]): this;
    addListener<U extends keyof RecognizerEvents>(event: U, listener: RecognizerEvents[U]): this;
    /**
     *
     * SpeechRecognition
     */
    listen(): Promise<string>;
}
export { Recognizer };
