import { isNonEmpty } from "ts-array-length";

export type Random = () => number;

export const randomInt = (min: number, max: number, random: Random = Math.random): number => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(random() * (max - min) + min);
};

export const shuffle = <T>(iterable: Iterable<T>, random: Random = Math.random): T[] => {
  const array = [...iterable];

  for (let index = array.length; index > 0; index--) {
    const k = Math.floor(random() * index);
    const temporary = array[k] as T;

    array[k] = array[index - 1] as T;
    array[index - 1] = temporary;
  }

  return array;
};

export const choice = <T>(elements: T[], random: Random = Math.random): T => {
  if (!isNonEmpty(elements)) {
    // TODO
    throw new RangeError("TODO: Error message");
  }

  const index = randomInt(0, elements.length, random);

  return elements[index] as T;
};
