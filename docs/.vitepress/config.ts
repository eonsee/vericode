import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '验证码预览器',
  description: '在线验证码预览工具 · Base64 解码 · 快速复制答案',
  lang: 'zh-CN',
  cleanUrls: true,
  themeConfig: {
    logo: '🔐',
    nav: [
      { text: '首页', link: '/' },
    ],
    socialLinks: [],
    search: {
      provider: 'local',
    },
    editLink: false,
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present',
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#63dbeb' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔐</text></svg>' }],
  ],
})
