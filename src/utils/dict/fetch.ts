import { Dictionary } from "@/utils/dict/types";
import urlJoin from "url-join";
import jsonpack from "jsonpack";
import { relative } from "@/utils/url";

const cache = new Map<string, Dictionary>();

export const fetchDictionary = async (path: string): Promise<Dictionary> => {
  const cached = cache.get(path);

  if (cached) {
    return cached;
  }

  // GET /xxx/generated/dict/xxx
  const response = await fetch(urlJoin(relative("generated/dict"), `${path}.jsonpack`));
  const packed = await response.text();
  const dict = jsonpack.unpack<unknown>(packed);
  const context = { errors: [] };

  if (!Dictionary(dict, context)) {
    throw context;
  }

  cache.set(path, dict);

  return dict;
};
