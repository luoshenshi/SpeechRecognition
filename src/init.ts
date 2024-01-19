import { spawn, exec } from "child_process";
import { EventEmitter } from "events";
import { Google } from "./google";

let transcript: string;

interface RecognizerEvents {
  whenReady: () => void;
  whenDone: () => void;
}
/**
 * Recognizer Class
 */
class Recognizer extends EventEmitter {
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

  constructor() {
    super();
    this.THRESHOLD = 250;
    this.LANGUAGE = "en-US";
    this.PRIORITY_FILTER = 0;
  }

  on<U extends keyof RecognizerEvents>(
    event: U,
    listener: RecognizerEvents[U]
  ): this {
    return super.on(event, listener);
  }

  addListener<U extends keyof RecognizerEvents>(
    event: U,
    listener: RecognizerEvents[U]
  ): this {
    return super.addListener(event, listener);
  }
  /**
   *
   * SpeechRecognition
   */
  listen(): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        `${__dirname}\\main.exe`,
        [this.THRESHOLD.toString()],
        {
          env: {
            PATH_TO_SAVE: __dirname,
          },
        }
      );

      child.stdout.on("data", (data: Buffer) => {
        const output: string = data.toString().trim();

        if (output.includes("true")) {
          this.emit("whenReady");
        } else if (output.includes("false")) {
          this.emit("whenDone");
        }
      });

      child.on("close", () => {
        exec(
          `"${__dirname}\\flac-win32.exe" "${__dirname}\\output.flac" -f "${__dirname}\\output.wav"`,
          async () => {
            try {
              transcript = await new Google().recognize_google(
                this.LANGUAGE,
                this.PRIORITY_FILTER
              );
              resolve(transcript);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    });
  }
}

export { Recognizer };
