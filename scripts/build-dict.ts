import { readdir, readFile, FileHandle, writeFile, mkdir } from "node:fs/promises";
import { join as joinPath, parse as parsePath } from "node:path";
import { PathLike } from "node:fs";
import jsonpack from "jsonpack";
import { buildDictionary } from "@/utils/dict/build";

const readFileAsLines = async (path: PathLike | FileHandle): Promise<string[]> => {
  const content = await readFile(path, "utf8");

  return content.split(/\r?\n/);
};

const textsAssetsPath = joinPath(process.cwd(), "assets/texts");
const dictPath = joinPath(process.cwd(), "public/generated/dict");

await readdir(textsAssetsPath)
  .then(textFiles => Promise.all(textFiles.map(async textFile => {
    const parsedPath = parsePath(textFile);
    const sentences = await readFileAsLines(joinPath(textsAssetsPath, textFile));
    const dict = await buildDictionary(sentences);
    const packed = jsonpack.pack(dict);

    await mkdir(dictPath, {
      recursive: true
    });
    await writeFile(joinPath(dictPath, `${parsedPath.name}.jsonpack`), packed, "utf8");
  })));
