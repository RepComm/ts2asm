# ts2asm
Compile typescript to x86 assembly<br/>
In the format of [the flat assembler](https://flatassembler.net/)

## why
Used as the compiler for [bugout](https://github.com/RepComm/bugout)<br>
AKA: I didn't want to write an OS in C<br>

## state
> Cannot produce assembly yet

Currently designing API that allows for language definition entirely within `JSON`

## running

> NOTE: This isn't ready for use yet

Requires [node](https://nodejs.org)

> NOTE: dir containing `ts2asm` should be added to the PATH environment variable

Run (ts2asm is used from PATH var)
```bash
ts2asm -in src/main.ts -out build
```

Run (ts2asm is not added to PATH var)
```bash
cd ~/Desktop/MyProject

path/to/ts2asm-install/ts2asm -in src/main.ts -out build
```

