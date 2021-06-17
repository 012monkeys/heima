module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 开启路由器懒加载插件
    '@babel/plugin-syntax-dynamic-import'
  ]
}
