import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default {
  input: './main.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false
    },
    {
      file: 'dist/index.esm.js',
      format: 'es'
    },
  ],
  external: ['axios', 'md5'],
  plugins: [
    resolve(), // 解析 node_modules 中的模块
    commonjs(), // 将 CommonJS 模块转换为 ES6 模块
    typescript({ // 处理 TypeScript 文件
      // include: ['**/*.d.ts', '**/*.ts'],
      // compilerOptions: {
      //   declaration: true, // 生成类型声明文件
      //   emitDeclarationOnly: true, // 仅生成声明文件，不编译代码
      //   outDir: 'dist',
      // },
      tsconfig: './tsconfig.json'
    }),
    copy({
      targets: [
        {
          src: "./package.json",
          dest: "dist",
        },
        {
          src: "./README.md",
          dest: "dist",
        },
      ],
    }),
  ],
};