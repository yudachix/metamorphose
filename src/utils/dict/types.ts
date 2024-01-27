import { $string, $array, $object, $u32, Infer } from "lizod";

export const Sentence = $object({
  nounIndexes: $array($u32),
  words: $array($string),
  original: $string
});

export type Sentence = Infer<typeof Sentence>;

export const Dictionary = $object({
  sentences: $array(Sentence)
});

export type Dictionary = Infer<typeof Dictionary>;
