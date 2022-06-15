import { defineNuxtConfig } from "nuxt";

export default defineNuxtConfig({
  build: {
    transpile: ["@heroicons/vue"],
    postcss: {
      postcssOptions: {
        plugins: {
          "tailwindcss/nesting": {},
          tailwindcss: {},
          autoprefixer: {},
        },
      },
    },
  },
  css: ["@/assets/css/tailwind.css", "@/assets/css/global.css"],
  buildModules: ["@pinia/nuxt"],
  runtimeConfig: {
    public: {
      API_BASE: process.env.API_URL,
      CDN_BASE: process.env.CDN_URL,
    },
  },
});
