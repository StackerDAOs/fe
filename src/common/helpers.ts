export const truncate = (str: string, firstCharCount = str.length, endCharCount = 0, dotCount = 3) => {
  let convertedStr='';
  convertedStr+=str.substring(0, firstCharCount);
  convertedStr += ".".repeat(dotCount);
  convertedStr+=str.substring(str.length-endCharCount, str.length);
  return convertedStr;
};

export const convertToken = (token: string) => {
  return parseInt(token) / 1000000;
};

export const ustxToStx = (uStx: string) => {
  return parseInt(uStx) / 1000000;
};

export const stxToUstx = (stx: string) => {
  return parseInt(stx) * 1000000;
};

export const pluckSourceCode = (sourceCode: string, param: string) => {
  const sourceParam = param[0].toUpperCase() + param.substring(1); 
  return sourceCode?.split(`;; ${sourceParam}: `)[1]?.split('\n')[0];
};

export const estimateDays = (blocksUntil: number) => {
  // TODO: estimate hours/minutes when blocksUntil is less than a day
  return Math.round(blocksUntil * 10 / 1440);
};

export const getPercentage = (totalVotes: number, votes: number) => {
  if (isNaN(Math.round((votes / totalVotes) * 100))) {
    return 0;
  } else {
    return Math.round((votes / totalVotes) * 100);
  }
};