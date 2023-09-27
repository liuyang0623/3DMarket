export {};

declare global {
  interface Window {
    NoCaptcha: any;
    AWSC: any;
    nc: any;
    FB: any;
    AppleID: any;
  }
  interface NodeRequire {
    context: any;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": MyElementAttributes;
    }
    interface MyElementAttributes {
      src: string;
      [key: string]: any;
    }
  }
}

declare const window: any;
