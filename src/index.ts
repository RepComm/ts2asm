
import * as path from "path";
import { readTextFile, readJsonFile, ensureDir } from "./aliases.js";

import { TypeScriptScanner } from "./langs/typescript.js";
import { tokenizer } from "./tokenizer/tokenizer.js";
import { parser } from "./parser/parser.js";
import { Language } from "./parser/language.js";

const PRG_ARGS = process.argv;

let textDec = new TextDecoder();
let textEnc = new TextEncoder();

//__dirname fix for node es module mode
const moduleURL = new URL(import.meta.url);
const __dirname = path.dirname(moduleURL.pathname);

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

  let tsScanner = new TypeScriptScanner();

  let tsLangPath = path.join(__dirname, "langs", "typescript.json");

  let tsLang = Language.fromJSON(
    await readJsonFile(
      tsLangPath
    )
  );
  console.log("Language", tsLang);

  tokenizer(src, tsScanner, ["whsp"]).then((tokens) => {
    console.log(tokens);

    doLog("Lexar finished, generating AST");

    let tree = parser(tsLang, tokens);
  }).catch((ex) => {
    console.error(ex);
  });

  //write the text file
  //TODO - have to write transpiled assembly, not source input
  //WRITE TO: path.join(cliOriginDir, outputFileName)
}

main();
