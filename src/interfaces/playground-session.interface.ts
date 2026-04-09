export interface PlaygroundSessionView {
  sessionId: string;
  number: string;
  parentName: string;
  parentPhone: string;
  parentCode: string
  childName: string;
  code: string;
  endTime: string;
  status: string;
  minutesLeft: number;
}

export interface PlaygroundSessionSearch {
  date: string;
  page: number;
  size: number;
}
