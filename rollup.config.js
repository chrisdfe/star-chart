// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'public/dist',
    format: 'cjs'
  },
  plugins: [typescript()]
};