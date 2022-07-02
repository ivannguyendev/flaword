import { Keywords, TKeywords } from "./keywords";
import { MirrorWord, Timing, withEach } from "./utils";
import _without from "lodash/without";
import _toPlainObject from "lodash/toPlainObject";

export class FlawordOptions {
  isEmpty: boolean;
  whitelist: TKeywords[] | string[];
  blacklist: TKeywords[] | string[];
  constructor(opts: Partial<FlawordOptions> = {}) {
    Object.assign(this, opts);
    this.isEmpty = this.isEmpty || false;
    this.blacklist = this.blacklist || [];
    this.whitelist = this.whitelist || [];
    return _toPlainObject(this)
  }
}

function FlawordChecker(
  value: Record<string, unknown>,
  options?: Partial<FlawordOptions>
) {
  const opts = new FlawordOptions(options);
  const defaultlist = opts.isEmpty ? [] : Keywords;
  const blacklist = MirrorWord().add(opts.blacklist).words;
  const whitelist = MirrorWord().add(opts.whitelist).words;
  const fulist = MirrorWord(defaultlist).add(blacklist, {
    trim: false,
  }).words;
  let words = _without(fulist, ...whitelist);
  let isFlaw = false;
  let keyFlaw;

  withEach({ value }, (obj, val: string, key: string) => {
    let shouldRecurse = true;
    if (
      words.some((predict) =>
        MirrorWord().add([val]).words.join(" ").includes(predict)
      )
    ) {
      isFlaw = true;
      shouldRecurse = false;
      keyFlaw = key;
    }
    return {
      shouldRecurse: shouldRecurse,
      key: key,
    };
  });

  return {
    isFlaw,
    key: keyFlaw,
  };
}

export const Flaword = {
  check: Timing(FlawordChecker),
};
