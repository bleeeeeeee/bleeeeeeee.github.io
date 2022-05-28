import { Md5 } from "ts-md5";

/**
 * What are you staring at? A hash of a string.
 * 
 * @param input text input
 * @returns hash of the input
 */
export const stringHash = (input: string) => new Md5().appendStr(input).end() as string;
