export const PLAYGROUND_SESSION_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
  ENDING_SOON: "ENDING_SOON",
  ALMOST_FINISHED: "ALMOST_FINISHED",
} as const;

export type PlaygroundSessionTypeStatus =
  (typeof PLAYGROUND_SESSION_STATUS)[keyof typeof PLAYGROUND_SESSION_STATUS];

export const PLAYGROUND_STATUS_BADGE = {
  ACTIVE: { bg: "#DCFCE7", text: "#166534" },
  INACTIVE: { bg: "#F3F4F6", text: "#374151" },
  EXPIRED: { bg: "#FEE2E2", text: "#991B1B" },
  ENDING_SOON: { bg: "#FFEDD5", text: "#9A3412" },
  ALMOST_FINISHED: { bg: "#FEF9C3", text: "#854D0E" },
};
