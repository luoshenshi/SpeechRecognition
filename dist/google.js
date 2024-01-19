"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Google = void 0;
const music_metadata_1 = __importDefault(require("music-metadata"));
const util_1 = __importDefault(require("util"));
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
let errorOutside;
class Google {
    constructor() { }
    recognize_google(language, priorityFilter) {
        return new Promise(async (resolve, reject) => {
            try {
                const metadata = await music_metadata_1.default.parseFile(`${__dirname}\\output.flac`);
                const resp = util_1.default.inspect(metadata, {
                    showHidden: false,
                    depth: null,
                });
                const parsedMetadata = eval(`(${resp})`);
                const audioContent = fs_1.default.readFileSync(`${__dirname}\\output.flac`);
                const sampleRate = parsedMetadata.format.sampleRate;
                const options = {
                    url: "http://www.google.com/speech-api/v2/recognize",
                    method: "POST",
                    headers: {
                        "Content-Type": `audio/x-flac; rate=${sampleRate}`,
                    },
                    qs: {
                        client: "chromium",
                        lang: language,
                        key: "AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw" /* :LOL:, you might be thinking, "This fool just leaked his API key," but it's not mine. I got it from Python's SpeechRecognition. I checked out the code and found this... lolol. Please don't use this key, or else the owner might change it. I don't use it for personal purposes either. */,
                        pFilter: priorityFilter,
                    },
                    body: audioContent,
                };
                (0, request_1.default)(options, (error, response, body) => {
                    if (error) {
                        if (error.code == "ENOTFOUND") {
                            errorOutside = "You are offline";
                        }
                        errorOutside =
                            errorOutside == undefined ? "Can't make request" : errorOutside;
                        reject(errorOutside);
                    }
                    else if (response.statusCode !== 200) {
                        reject(`Request failed with status code: ${response.statusCode}`);
                    }
                    else {
                        try {
                            const parsedBody = body
                                .split("\n")
                                .filter(Boolean)
                                .map((item) => JSON.parse(item));
                            const transcript = parsedBody[parsedBody.length - 1].result[0].alternative[0]
                                .transcript;
                            resolve(transcript);
                        }
                        catch (e) {
                            reject(`Didn't catch that`);
                        }
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.Google = Google;
//# sourceMappingURL=google.js.map