# SpeechRecognition

SpeechRecognition is a free library that enables the conversion of speech into text. It's essentially a JavaScript adaptation of Python's [SpeechRecognition](https://pypi.org/project/SpeechRecognition/) library, and no it doesn't require Python to be installed on your system.

## Installation

To use SpeechRecognition, you first need to install it using the following command:

```bash
npm install speechrecognition
```

## How to Use

Once you have successfully installed the library, you can use it as follows:

```javascript
const { Recognizer } = require("speechrecognition");
const recognizer = new Recognizer();

recognizer.addListener("whenReady", () => {
  console.log("I'm Listening...");
});

(async () => {
  try {
    const transcript = await recognizer.listen();
    console.log(transcript);
  } catch (error) {
    console.log(error);
  }
})();
```

I apologize but this library is currently not compatible with Mac and Linux.

## Expected Future Changes

I'm actively working on making this library compatible with Linux and Mac operating systems. Stay tuned for updates!