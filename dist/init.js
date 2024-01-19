"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recognizer = void 0;
const child_process_1 = require("child_process");
const events_1 = require("events");
const google_1 = require("./google");
let transcript;
/**
 * Recognizer Class
 */
class Recognizer extends events_1.EventEmitter {
    constructor() {
        super();
        this.THRESHOLD = 250;
        this.LANGUAGE = "en-US";
        this.PRIORITY_FILTER = 0;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    addListener(event, listener) {
        return super.addListener(event, listener);
    }
    /**
     *
     * SpeechRecognition
     */
    listen() {
        return new Promise((resolve, reject) => {
            const child = (0, child_process_1.spawn)(`${__dirname}\\main.exe`, [this.THRESHOLD.toString()], {
                env: {
                    PATH_TO_SAVE: __dirname,
                },
            });
            child.stdout.on("data", (data) => {
                const output = data.toString().trim();
                if (output.includes("true")) {
                    this.emit("whenReady");
                }
                else if (output.includes("false")) {
                    this.emit("whenDone");
                }
            });
            child.on("close", () => {
                (0, child_process_1.exec)(`"${__dirname}\\flac-win32.exe" "${__dirname}\\output.flac" -f "${__dirname}\\output.wav"`, async () => {
                    try {
                        transcript = await new google_1.Google().recognize_google(this.LANGUAGE, this.PRIORITY_FILTER);
                        resolve(transcript);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            });
        });
    }
}
exports.Recognizer = Recognizer;
//# sourceMappingURL=init.js.map