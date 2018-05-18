import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/app.js',
  output: {
    file: 'src/bundle.js',
    name: 'app',
    format: 'umd',
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      module: true
    })
  ],
  watch: {
    chokidar: false
  }
};
