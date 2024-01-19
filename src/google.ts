import musicMetadata from "music-metadata";
import util from "util";
import request from "request";
import fs from "fs";
let errorOutside: string;

class Google {
  constructor() {}

  recognize_google(language: string, priorityFilter: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const metadata = await musicMetadata.parseFile(
          `${__dirname}\\output.flac`
        );
        const resp: string = util.inspect(metadata, {
          showHidden: false,
          depth: null,
        });

        const parsedMetadata: any = eval(`(${resp})`);

        const audioContent: Buffer = fs.readFileSync(
          `${__dirname}\\output.flac`
        );
        const sampleRate: string = parsedMetadata.format.sampleRate;

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

        request(options, (error: any, response: any, body: any) => {
          if (error) {
            if (error.code == "ENOTFOUND") {
              errorOutside = "You are offline";
            }
            errorOutside =
              errorOutside == undefined ? "Can't make request" : errorOutside;
            reject(errorOutside);
          } else if (response.statusCode !== 200) {
            reject(`Request failed with status code: ${response.statusCode}`);
          } else {
            try {
              const parsedBody = body
                .split("\n")
                .filter(Boolean)
                .map((item: string) => JSON.parse(item));
              const transcript =
                parsedBody[parsedBody.length - 1].result[0].alternative[0]
                  .transcript;
              resolve(transcript);
            } catch (e) {
              reject(`Didn't catch that`);
            }
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export { Google };
