export const ESC_CMDS = {
  INIT: "\u001B@",
  ESC: "\u001B",
  GS: "\u001D",
  TXT_NORMAL: "\u001B!\u0000",
  BOLD_ON: "\u001BE\u0001",
  BOLD_OFF: "\u001BE\u0000",
  SIZE_DBL: "\u001D!\u0011",
  ALIGN_CTR: "\u001Ba\u0001",
  ALIGN_LT: "\u001Ba\u0000",
  CUT: "\u001BJ\u0020\u001DV\u0042\u0000", // Feed & Cut
};
export const line = (maxLength: number) => {
  return "-".repeat(maxLength);
};
export const wordWrap = (str: string, limit: number) => {
  const regex = new RegExp(`(.{1,${limit}})(\\s|$)`, "g");
  return str.match(regex) || [str];
};

export const justifyText = (left: string, right: string, maxLength: number) => {
  const spaceCount = Math.max(1, maxLength - (left.length + right.length));
  return left + " ".repeat(spaceCount) + right;
};
