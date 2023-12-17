/// <reference types="vite/client" />
/// <reference types="svelte" />

declare const __VERSION_PREACT__: string
declare const __VERSION_REACT__: string
declare const __VERSION_SVELTE__: string
declare const __VERSION_SOLID_JS__: string
declare const __VERSION_VUE__: string
declare const __TIMESCAPE_REACT_TYPES__: string

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
