import _isPlainObject from "lodash/isPlainObject";
import _uniq from "lodash/uniq";
import { Debug } from "./debug";

/**
 * Through properties Object
 *
 * @export
 * @param {*} target
 * @param {(obj, val, key) => { shouldRecurse; key }} cb
 */
export function withEach(
  target,
  cb: (obj, val, key) => { shouldRecurse; key }
) {
  (function act(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(act);
    } else if (_isPlainObject(obj)) {
      Object.keys(obj).forEach(function (key) {
        const val = obj[key];
        if (_isPlainObject(val)) {
          act(val);
          return;
        }
        const resp = cb(obj, val, key);
        if (resp.shouldRecurse) {
          act(obj[resp.key || key]);
          return;
        }
      });
    }
  })(target);
}

/**
 * generate new array
 * - remove spacing
 * - remove duplicate
 *
 * @export
 * @param {readonly} strs
 * @param {*} string
 * @param {*} []
 * @param {*}
 * @param {*} string
 * @param {*} []
 * @return {*}
 */
export function MirrorWord(strs: readonly string[] | string[] = []) {
  let words = strs;
  function getOptions(opts: { unique?: boolean; trim?: boolean }) {
    opts.trim = typeof opts.trim === "boolean" ? opts.trim : true;
    opts.unique = typeof opts.unique === "boolean" ? opts.unique : true;
    return opts;
  }
  function assertArray(newStrs) {
    if (!Array.isArray(newStrs))
      throw new Error("generate new keyword is failed");
  }
  let instance = {
    get words() {
      return words;
    },
    add: (
      newStrs: readonly string[] | string[],
      options: { unique?: boolean; trim?: boolean } = {}
    ) => {
      assertArray(newStrs);
      options = getOptions(options);
      // access method property
      let mirrorStrs: string[] = [];
      if (options.trim)
        mirrorStrs = newStrs.map((s) => String(s).replace(/ /g, ""));
      // access class property
      words = mirrorStrs.concat(newStrs).concat(words);
      if (options.unique) words = _uniq(words);
      return instance;
    },
  };

  return instance;
}

/**
 * Count time any function
 *
 * @export
 * @template T
 * @param {T} target
 * @return {*}  {T}
 */
export function Timing<T extends Function>(target: T): T {
  const targetName = target?.name || "anonymous";
  const debug = Debug(targetName);
  return DynamicFunction(targetName, (...args) => {
    const startTime = Date.now();
    try {
      const targetResult = target.apply(null, args);
      if (!targetResult?.then) return targetResult;
      return targetResult.finally(() => {
        debug("take", Date.now() - startTime, "ms");
      });
    } catch (e) {
      throw e;
    } finally {
      debug("take", Date.now() - startTime, "ms");
    }
  });
}

/**
 * Ref: https://stackoverflow.com/questions/5905492/dynamic-function-name-in-javascript/69465672#69465672
 *
 * @param {*} name
 * @param {*} fn
 */
const DynamicFunction = (name, fn) =>
  Object.defineProperty(fn, "name", { value: name });
