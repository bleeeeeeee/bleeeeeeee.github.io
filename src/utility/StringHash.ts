import { Md5 } from "ts-md5";

export const stringHash = (input: string) => new Md5().appendStr(input).end() as string;
