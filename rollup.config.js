import livereload from 'rollup-plugin-livereload';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';

export default {
    input: 'src/app.ts',
    output: {
        file: 'dist/build/bundle.js',
        sourcemap: true,
    },
    plugins: [
        livereload(),
        typescript({
            sourceMap: true
        }),
        scss({
            output: 'dist/build/styles.css'
        }),
    ],
}