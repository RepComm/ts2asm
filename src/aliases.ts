
import * as fs from "fs";

let txtDec = new TextDecoder();

export const readFile = (fpath: string): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    fs.readFile(fpath, {}, (err, buffer) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(buffer);
    });
  });
}

export const readTextFile = (fpath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    readFile(fpath).catch(reject).then((buf) => {
      if (!buf) {
        reject("Buffer was null or undefined");
        return;
      }
      resolve(txtDec.decode(buf));
    });
  });
}

/**Read a json file w/ schema
 * @param fpath path to the file
 * @param reviver A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.
 */
export function readJsonFile <T>(fpath: string, reviver?: (this: any, key: string, value: any) => any): Promise<T> {
  return new Promise<T>( async (resolve, reject)=>{
    let txt = await readTextFile(fpath);
    let result = JSON.parse(txt, reviver);
    resolve(result);
  });
}

export const ensureDir = (dpath: string, create: boolean = true): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.access(dpath, (err) => {
      if (err) {
        if (create) {
          //It didn't exist, try to create
          fs.mkdir(dpath, (err) => {
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
}
