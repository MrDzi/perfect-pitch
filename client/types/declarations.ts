// API_URL comes from webpack config
declare const API_URL: string;

// https://github.com/TypeStrong/ts-loader/issues/37#issuecomment-381375624
const _API_URL = API_URL;
export { _API_URL as API_URL };
