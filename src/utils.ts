export const omitEmitWords = (emitWords: string[], content: string) => {
  let res = content;
  for (const word of emitWords) {
    if (content.startsWith(word)) {
      res = res.replace(word, "");
    }
  }
  // 去除开头的逗号
  if (res[0] === "," || res[0] === "，") {
    res = res.slice(1);
  }
  return res;
};
