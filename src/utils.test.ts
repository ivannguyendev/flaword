import test from "ava";
import { Keywords } from "./keywords";
import * as Target from "./utils";

test(`${Target.withEach.name} recurse to value`, (t) => {
  const testValue = "helloword";
  Target.withEach({ value: { filter: testValue } }, (obj, val, key) => {
    t.is(val, testValue, val);
    return {
      key: key,
      shouldRecurse: true,
    };
  });
});

test(`${Target.MirrorWord.name} add keyword`, (t) => {
  const fullWords = Target.MirrorWord([]).add(["test 2"]).words;
  t.is(fullWords.length, 2);
});

test(`${Target.MirrorWord.name} add duplicate keyword`, (t) => {
  const fullWords = Target.MirrorWord(["test1"]).add(["test2", "test1"]).words;
  t.is(fullWords.length, 2);
});

test(`${Target.MirrorWord.name} add spacing duplicate keyword`, (t) => {
  const defaultLength = Keywords.length;
  const fullWords = Target.MirrorWord(Keywords).add(["test 1"]).words;
  t.is(fullWords.length, defaultLength + 2);
});

test(`${Target.MirrorWord.name} add untrim keyword`, (t) => {
  const defaultLength = Keywords.length;
  const fullWords = Target.MirrorWord(Keywords).add(["test 1"], {
    trim: false,
  }).words;
  t.is(fullWords.length, defaultLength + 1);
});

test(`${Target.MirrorWord.name} add untrim and deunique keyword`, (t) => {
  const defaultLength = Keywords.length;
  const fullWords = Target.MirrorWord(Keywords).add(["test 1", "test 1"], {
    trim: false,
    unique: false,
  }).words;
  t.is(fullWords.length, defaultLength + 2);
});

test(`${Target.MirrorWord.name} add deunique keyword`, (t) => {
  const defaultLength = Keywords.length;
  const fullWords = Target.MirrorWord(Keywords).add(["test 1", "test 1"], {
    unique: false,
  }).words;
  t.is(fullWords.length, defaultLength + 4);
});

test(`${Target.Timing.name} success`, (t) => {
  const isTrue = Target.Timing(() => true)();
  t.is(isTrue, true);
});
test(`${Target.Timing.name} throw error`, (t) => {
  const expectMessage = "this is error";
  try {
    Target.Timing(() => {
      throw Error(expectMessage);
    })();
  } catch (err) {
    t.is(err.message, expectMessage);
  }
});
test(`${Target.Timing.name} promise success`, async (t) => {
  const isTrue = await Target.Timing(async () => true)();
  t.is(isTrue, true);
});
test(`${Target.Timing.name} throw promise`, async (t) => {
  const expectMessage = "this is error";
  try {
    await Target.Timing(async () => {
      throw Error(expectMessage);
    })();
  } catch (err) {
    t.is(err.message, expectMessage);
  }
});
