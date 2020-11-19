
import * as path from "https://deno.land/std/path/mod.ts";
import { walk, exists, ensureDirSync, ensureDir } from "https://deno.land/std/fs/mod.ts";

let port: number = 8080;
let textDec = new TextDecoder();
let textEnc = new TextEncoder();

// function cwd (): string {
//   return path.dirname(path.fromFileUrl(import.meta.url));
// }

interface Options {
  INPUT_FILE?: string;
  OUTPUT_DIR: string;
}

let options: Options = {
  OUTPUT_DIR: "build"
}

for (let i = 0; i < Deno.args.length; i++) {
  let arg: string = Deno.args[i];
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
  Deno.exit(-1);
}
if (!options.OUTPUT_DIR) {
  doWarn("Output dir is not specified, 'build' will be used instead, you can use -help");
}

//TODO - traverse imports
let src: string = await Deno.readTextFile(options.INPUT_FILE);
doLog(
  "Found input",
  src
);

//Make sure output dir exists
await ensureDir(options.OUTPUT_DIR);

//grab the input filename without path
let fname = path.basename(options.INPUT_FILE);

//create a similar named output file, but with output dir
let fpath = path.join(options.OUTPUT_DIR, fname);

//TODO - lexer (probably snatch from recursive-descent-parser)

//write the text file
//TODO - have to write transpiled assembly, not source input
await Deno.writeTextFile(fpath, src, { create: true });

