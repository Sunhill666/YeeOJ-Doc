import { defineUserConfig, defaultTheme } from 'vuepress';
import { copyCodePlugin } from 'vuepress-plugin-copy-code2';
import { shikiPlugin } from '@vuepress/plugin-shiki';



export default defineUserConfig({
  lang: 'zh-CN',
  title: 'YeeOnlineJudge Wiki',
  description: 'YeeOnlineJudge 相关文档站点',
  dest: "/usr/workfolder/YeeOJ-Doc/dist",
  head: [['link', { rel: 'icon', href: '/images/Trans.png' }]],
  theme: defaultTheme({
    navbar: [
      {
        text: '指南',
        link: '/guide/',
      },
      {
        text: '接口文档',
        link: '/api-doc/',
      },
      {
        text: '开发文档',
        link: '/dd/',
      },
      {
        text: '需求文档',
        link: '/prd/',
      }
    ],
    logo: '/images/Trans.png',
    repo: 'Sunhill666/YeeOnlineJudge',
    editLinkText: '在Github上编辑此页'
  }),
  plugins: [
    copyCodePlugin(),
    shikiPlugin({
      theme: 'one-dark-pro'
    })
  ]
})