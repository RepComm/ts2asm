import * as fs from "fs";
let txtDec = new TextDecoder();
export const readFile = fpath => {
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, {}, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(buffer);
    });
  });
};
export const readTextFile = fpath => {
  return new Promise((resolve, reject) => {
    readFile(fpath).catch(reject).then(buf => {
      if (!buf) {
        reject("Buffer was null or undefined");
        return;
      }

      resolve(txtDec.decode(buf));
    });
  });
};
export const ensureDir = (dpath, create = true) => {
  return new Promise((resolve, reject) => {
    fs.access(dpath, err => {
      if (err) {
        if (create) {
          //It didn't exist, try to create
          fs.mkdir(dpath, err => {
            if (err) {
              //Could create it
              reject();
              throw `Path ${dpath} does not exist, and failed to create, see node fs error: ${err}`;
            } else {
              //It got created
              resolve();
            }
          });
        } else {
          //It didn't exist, and we aren't allowed to create it
          throw `Path ${dpath} doesn't exist, and 'create' argument is false, see error: ${err}`;
        }
      } else {
        //It exists, move on
        resolve();
      }
    });
  });
};