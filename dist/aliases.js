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
/**Read a json file w/ schema
 * @param fpath path to the file
 * @param reviver A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.
 */

export function readJsonFile(fpath, reviver) {
  return new Promise(async (resolve, reject) => {
    let txt = await readTextFile(fpath);
    let result = JSON.parse(txt, reviver);
    resolve(result);
  });
}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hbGlhc2VzLnRzIl0sIm5hbWVzIjpbImZzIiwidHh0RGVjIiwiVGV4dERlY29kZXIiLCJyZWFkRmlsZSIsImZwYXRoIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJlcnIiLCJidWZmZXIiLCJyZWFkVGV4dEZpbGUiLCJjYXRjaCIsInRoZW4iLCJidWYiLCJkZWNvZGUiLCJyZWFkSnNvbkZpbGUiLCJyZXZpdmVyIiwidHh0IiwicmVzdWx0IiwiSlNPTiIsInBhcnNlIiwiZW5zdXJlRGlyIiwiZHBhdGgiLCJjcmVhdGUiLCJhY2Nlc3MiLCJta2RpciJdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxLQUFLQSxFQUFaLE1BQW9CLElBQXBCO0FBRUEsSUFBSUMsTUFBTSxHQUFHLElBQUlDLFdBQUosRUFBYjtBQUVBLE9BQU8sTUFBTUMsUUFBUSxHQUFJQyxLQUFELElBQXdDO0FBQzlELFNBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0Q1AsSUFBQUEsRUFBRSxDQUFDRyxRQUFILENBQVlDLEtBQVosRUFBbUIsRUFBbkIsRUFBdUIsQ0FBQ0ksR0FBRCxFQUFNQyxNQUFOLEtBQWlCO0FBQ3RDLFVBQUlELEdBQUosRUFBUztBQUNQRCxRQUFBQSxNQUFNLENBQUNDLEdBQUQsQ0FBTjtBQUNBO0FBQ0Q7O0FBQ0RGLE1BQUFBLE9BQU8sQ0FBQ0csTUFBRCxDQUFQO0FBQ0QsS0FORDtBQU9ELEdBUk0sQ0FBUDtBQVNELENBVk07QUFZUCxPQUFPLE1BQU1DLFlBQVksR0FBSU4sS0FBRCxJQUFvQztBQUM5RCxTQUFPLElBQUlDLE9BQUosQ0FBWSxDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFDdENKLElBQUFBLFFBQVEsQ0FBQ0MsS0FBRCxDQUFSLENBQWdCTyxLQUFoQixDQUFzQkosTUFBdEIsRUFBOEJLLElBQTlCLENBQW9DQyxHQUFELElBQVM7QUFDMUMsVUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDUk4sUUFBQUEsTUFBTSxDQUFDLDhCQUFELENBQU47QUFDQTtBQUNEOztBQUNERCxNQUFBQSxPQUFPLENBQUNMLE1BQU0sQ0FBQ2EsTUFBUCxDQUFjRCxHQUFkLENBQUQsQ0FBUDtBQUNELEtBTkQ7QUFPRCxHQVJNLENBQVA7QUFTRCxDQVZNO0FBWVA7QUFDQTtBQUNBO0FBQ0E7O0FBQ0EsT0FBTyxTQUFTRSxZQUFULENBQTBCWCxLQUExQixFQUF5Q1ksT0FBekMsRUFBNEc7QUFDakgsU0FBTyxJQUFJWCxPQUFKLENBQWdCLE9BQU9DLE9BQVAsRUFBZ0JDLE1BQWhCLEtBQXlCO0FBQzlDLFFBQUlVLEdBQUcsR0FBRyxNQUFNUCxZQUFZLENBQUNOLEtBQUQsQ0FBNUI7QUFDQSxRQUFJYyxNQUFNLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXSCxHQUFYLEVBQWdCRCxPQUFoQixDQUFiO0FBQ0FWLElBQUFBLE9BQU8sQ0FBQ1ksTUFBRCxDQUFQO0FBQ0QsR0FKTSxDQUFQO0FBS0Q7QUFFRCxPQUFPLE1BQU1HLFNBQVMsR0FBRyxDQUFDQyxLQUFELEVBQWdCQyxNQUFlLEdBQUcsSUFBbEMsS0FBMEQ7QUFDakYsU0FBTyxJQUFJbEIsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUN0Q1AsSUFBQUEsRUFBRSxDQUFDd0IsTUFBSCxDQUFVRixLQUFWLEVBQWtCZCxHQUFELElBQVM7QUFDeEIsVUFBSUEsR0FBSixFQUFTO0FBQ1AsWUFBSWUsTUFBSixFQUFZO0FBQ1Y7QUFDQXZCLFVBQUFBLEVBQUUsQ0FBQ3lCLEtBQUgsQ0FBU0gsS0FBVCxFQUFpQmQsR0FBRCxJQUFTO0FBQ3ZCLGdCQUFJQSxHQUFKLEVBQVM7QUFDUDtBQUNBRCxjQUFBQSxNQUFNO0FBQ04sb0JBQU8sUUFBT2UsS0FBTSw2REFBNERkLEdBQUksRUFBcEY7QUFDRCxhQUpELE1BSU87QUFDTDtBQUNBRixjQUFBQSxPQUFPO0FBQ1I7QUFDRixXQVREO0FBVUQsU0FaRCxNQVlPO0FBQ0w7QUFDQSxnQkFBTyxRQUFPZ0IsS0FBTSw4REFBNkRkLEdBQUksRUFBckY7QUFDRDtBQUNGLE9BakJELE1BaUJPO0FBQ0w7QUFDQUYsUUFBQUEsT0FBTztBQUNSO0FBQ0YsS0F0QkQ7QUF1QkQsR0F4Qk0sQ0FBUDtBQXlCRCxDQTFCTSIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5cbmxldCB0eHREZWMgPSBuZXcgVGV4dERlY29kZXIoKTtcblxuZXhwb3J0IGNvbnN0IHJlYWRGaWxlID0gKGZwYXRoOiBzdHJpbmcpOiBQcm9taXNlPFVpbnQ4QXJyYXk+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBmcy5yZWFkRmlsZShmcGF0aCwge30sIChlcnIsIGJ1ZmZlcikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShidWZmZXIpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlYWRUZXh0RmlsZSA9IChmcGF0aDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICByZWFkRmlsZShmcGF0aCkuY2F0Y2gocmVqZWN0KS50aGVuKChidWYpID0+IHtcbiAgICAgIGlmICghYnVmKSB7XG4gICAgICAgIHJlamVjdChcIkJ1ZmZlciB3YXMgbnVsbCBvciB1bmRlZmluZWRcIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUodHh0RGVjLmRlY29kZShidWYpKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlJlYWQgYSBqc29uIGZpbGUgdy8gc2NoZW1hXG4gKiBAcGFyYW0gZnBhdGggcGF0aCB0byB0aGUgZmlsZVxuICogQHBhcmFtIHJldml2ZXIgQSBmdW5jdGlvbiB0aGF0IHRyYW5zZm9ybXMgdGhlIHJlc3VsdHMuIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGZvciBlYWNoIG1lbWJlciBvZiB0aGUgb2JqZWN0LiBJZiBhIG1lbWJlciBjb250YWlucyBuZXN0ZWQgb2JqZWN0cywgdGhlIG5lc3RlZCBvYmplY3RzIGFyZSB0cmFuc2Zvcm1lZCBiZWZvcmUgdGhlIHBhcmVudCBvYmplY3QgaXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkSnNvbkZpbGUgPFQ+KGZwYXRoOiBzdHJpbmcsIHJldml2ZXI/OiAodGhpczogYW55LCBrZXk6IHN0cmluZywgdmFsdWU6IGFueSkgPT4gYW55KTogUHJvbWlzZTxUPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxUPiggYXN5bmMgKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICBsZXQgdHh0ID0gYXdhaXQgcmVhZFRleHRGaWxlKGZwYXRoKTtcbiAgICBsZXQgcmVzdWx0ID0gSlNPTi5wYXJzZSh0eHQsIHJldml2ZXIpO1xuICAgIHJlc29sdmUocmVzdWx0KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBlbnN1cmVEaXIgPSAoZHBhdGg6IHN0cmluZywgY3JlYXRlOiBib29sZWFuID0gdHJ1ZSk6IFByb21pc2U8dm9pZD4gPT4ge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLmFjY2VzcyhkcGF0aCwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBpZiAoY3JlYXRlKSB7XG4gICAgICAgICAgLy9JdCBkaWRuJ3QgZXhpc3QsIHRyeSB0byBjcmVhdGVcbiAgICAgICAgICBmcy5ta2RpcihkcGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAvL0NvdWxkIGNyZWF0ZSBpdFxuICAgICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICAgICAgdGhyb3cgYFBhdGggJHtkcGF0aH0gZG9lcyBub3QgZXhpc3QsIGFuZCBmYWlsZWQgdG8gY3JlYXRlLCBzZWUgbm9kZSBmcyBlcnJvcjogJHtlcnJ9YDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vSXQgZ290IGNyZWF0ZWRcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vSXQgZGlkbid0IGV4aXN0LCBhbmQgd2UgYXJlbid0IGFsbG93ZWQgdG8gY3JlYXRlIGl0XG4gICAgICAgICAgdGhyb3cgYFBhdGggJHtkcGF0aH0gZG9lc24ndCBleGlzdCwgYW5kICdjcmVhdGUnIGFyZ3VtZW50IGlzIGZhbHNlLCBzZWUgZXJyb3I6ICR7ZXJyfWA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vSXQgZXhpc3RzLCBtb3ZlIG9uXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=