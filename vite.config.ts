import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import monkey, {cdn, MonkeyUserScript} from 'vite-plugin-monkey';
import path from 'path'

// ==========================
// ==== 开发调试的支持代码 =====
// ==========================
let userscript: MonkeyUserScript = {
  namespace: 'npm/vite-plugin-monkey',
  author: 'QQ2402398917',
  version: '0.0.1',
}

if (process.env.NODE_ENV === 'development') {
  // 仅在开发环境运行的代码
  userscript = {
    ...userscript,
    match: ['https://www.google.com/'],
  }
}


function resolve(pathName: string) {
  return path.resolve(__dirname, pathName)
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('src'),
      '@components': resolve( 'src/components'),
      '@utils': resolve('src/utils'),
      // 可以根据项目需求添加更多别名
    },
  },
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      userscript,
      build: {
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
  ],
});
