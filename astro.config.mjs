import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.sunil17.com.np',
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false }
});
