import urlJoin from "url-join";

const BASE_PATH = process.env.BASE_PATH ?? "";

export const relative = (url: string): string => {
  return urlJoin(BASE_PATH, url);
};
