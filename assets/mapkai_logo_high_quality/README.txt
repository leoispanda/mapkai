MapKAI high-quality logo package

原则：
- 没有重画图标
- 没有改变 MAPKAI 字体
- 没有改变原始结构
- 只做高清网站化处理：裁切、透明背景、尺寸适配、favicon/app icon 输出

推荐使用：
1. 网站顶部导航栏：
   mapkai-logo-transparent.png
   或 mapkai-logo-transparent-800px.png

2. 浏览器 favicon：
   favicon.ico

3. Apple Touch Icon：
   mapkai-icon-square-180.png

4. PWA / Android：
   mapkai-icon-square-192.png
   mapkai-icon-square-512.png

5. 深色背景测试：
   preview-on-dark-background.png

6. SVG：
   mapkai-logo-safe.svg
   注意：这是“安全 SVG wrapper”，内部嵌入透明 PNG。
   这样可以保留原始图标和文字，不会因为自动矢量描摹导致变形。

建议放入网站 public/ 目录：
/public/mapkai-logo-transparent.png
/public/favicon.ico
/public/mapkai-icon-square-180.png
/public/mapkai-icon-square-192.png
/public/mapkai-icon-square-512.png

HTML 示例：
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/mapkai-icon-square-180.png">
<img src="/mapkai-logo-transparent.png" alt="MapKAI" class="site-logo">

CSS 建议：
.site-logo {
  height: 34px;
  width: auto;
  display: block;
}

如果导航栏空间较小：
.site-logo {
  height: 28px;
}
