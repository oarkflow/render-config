declare module 'css-box-model' {
  export interface Box {
    contentBox: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    marginBox: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    borderBox: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
    paddingBox: {
      width: number;
      height: number;
      top: number;
      left: number;
    };
  }

  export function getBox(element: HTMLElement): Box;
}
