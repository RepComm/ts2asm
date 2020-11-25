
import * as path from "path";
import { readTextFile, ensureDir } from "./aliases.js";

import { TypeScriptScanner } from "./langs/typescript.js";
import { tokenizer } from "./tokenizer/tokenizer.js";

const PRG_ARGS = process.argv;

let textDec = new TextDecoder();
let textEnc = new TextEncoder();

interface Options {
  INPUT_FILE?: string;
  OUTPUT_DIR: string;
}

let options: Options = {
  OUTPUT_DIR: "build"
}

for (let i = 0; i < PRG_ARGS.length; i++) {
  let arg: string = PRG_ARGS[i];
  if (arg.startsWith("-")) {
    let argparts = arg.split("=");
    let aname = argparts[0];
    let avalue = argparts[1];

    switch (aname) {
      case "-in":
        options.INPUT_FILE = avalue;
        break;
      case "-out":
        options.OUTPUT_DIR = avalue;
        break;
      case "-help":
        doHelp();
    }
  }
}

function doError(...msgs: string[]) {
  console.error(...msgs);
}

function doWarn(...msgs: string[]) {
  console.warn(...msgs);
}

function doLog(...msgs: string[]) {
  console.log(...msgs);
}

function doHelp() {
  doLog(
    "-help .. shows this message",
    "-in [fpath] .. specified input file, relative to cwd",
    "-out [dpath] .. specified the output dir, relative to cwd"
  );
}

if (!options.INPUT_FILE) {
  doError("No input file specified, you can use -help");
  process.exit(-1);
}
if (!options.OUTPUT_DIR) {
  doWarn("Output dir is not specified, 'build' will be used instead, you can use -help");
}

async function main() {
  //TODO - traverse imports
  let src: string = await readTextFile(options.INPUT_FILE);
  doLog(
    "Reading",
    options.INPUT_FILE
  );

  //Make sure output dir exists
  await ensureDir(options.OUTPUT_DIR);

  //grab the input filename without path
  let inputFileName = path.basename(options.INPUT_FILE);

  let outputFileName = inputFileName;
  let inputFileExt = path.extname(inputFileName);
  if (outputFileName.endsWith(inputFileExt)) {
    outputFileName = inputFileName.substring(0, inputFileName.length - inputFileExt.length);
    outputFileName += ".asm";
  }

  doLog(`Parsing ${inputFileName}, will output to ${outputFileName}`);

  //create a similar named output file, but with output dir
  let outputFilePath = path.join(options.OUTPUT_DIR, inputFileName);

  let jsScanner = new TypeScriptScanner();
  tokenizer(src, jsScanner, ["whsp"]).then((tokens)=>{
    console.log(tokens);
  }).catch((ex)=>{
    console.error(ex);
  });

  doLog("Lexar finished");
  //write the text file
  //TODO - have to write transpiled assembly, not source input
}

main();
