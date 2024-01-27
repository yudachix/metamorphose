import { Dictionary, Sentence } from "@/utils/dict/types";
import kuromoji, { IpadicFeatures, Tokenizer } from "kuromoji";
import { isNonEmpty } from "ts-array-length";

const buildTokenizer = () => new Promise<Tokenizer<IpadicFeatures>>((resolve, reject) => {
  const builder = kuromoji.builder({
    dicPath: "node_modules/kuromoji/dict"
  });

  builder.build((error, tokenizer) => {
    if (error) {
      reject(error);
    } else {
      resolve(tokenizer);
    }
  });
});

export const buildDictionary = async (sentences: string[]): Promise<Dictionary> => {
  const tokenizer = await buildTokenizer();
  const sentenceMap = new Map<string, Sentence>();

  for (const sentence of sentences) {
    const words: string[] = [];
    const nounIndexes: number[] = [];
    let reading = "";

    for (const [index, feature] of tokenizer.tokenize(sentence).entries()) {
      if (feature.reading) {
        reading += feature.reading;
      }

      words.push(feature.surface_form);

      if (feature.pos !== "名詞") {
        continue;
      }

      if (feature.pos_detail_1 === "数") {
        continue;
      }

      nounIndexes.push(index);
    }

    if (sentenceMap.has(reading)) {
      continue;
    }

    if (!isNonEmpty(nounIndexes)) {
      continue;
    }

    if (sentence.length === 1) {
      continue;
    }

    sentenceMap.set(reading, {
      original: sentence,
      words,
      nounIndexes
    });
  }

  return {
    sentences: [...sentenceMap.values()]
  };
};
