import * as path from "path";
import { readTextFile, ensureDir } from "./aliases.js"; // import { JavaScriptScanner, tokenizer } from "@repcomm/rdp-ts";

const PRG_ARGS = process.argv;
let textDec = new TextDecoder();
let textEnc = new TextEncoder(); // function cwd (): string {
//   return path.dirname(path.fromFileUrl(import.meta.url));
// }

let options = {
  OUTPUT_DIR: "build"
};

for (let i = 0; i < PRG_ARGS.length; i++) {
  let arg = PRG_ARGS[i];

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

function doError(...msgs) {
  console.error(...msgs);
}

function doWarn(...msgs) {
  console.warn(...msgs);
}

function doLog(...msgs) {
  console.log(...msgs);
}

function doHelp() {
  doLog("-help .. shows this message", "-in [fpath] .. specified input file, relative to cwd", "-out [dpath] .. specified the output dir, relative to cwd");
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
  let src = await readTextFile(options.INPUT_FILE);
  doLog("Found input", src); //Make sure output dir exists

  await ensureDir(options.OUTPUT_DIR); //grab the input filename without path

  let fname = path.basename(options.INPUT_FILE); //create a similar named output file, but with output dir

  let fpath = path.join(options.OUTPUT_DIR, fname); //TODO - lexer (probably snatch from recursive-descent-parser)
  // let jsScanner = new JavaScriptScanner();
  // let tokens = await tokenizer(src, jsScanner, ["whsp"]);
  // console.log(tokens);
  //write the text file
  //TODO - have to write transpiled assembly, not source input
  // await Deno.writeTextFile(fpath, src, { create: true });
}

main();