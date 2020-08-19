1. 本地开发测试demo:
```
npm run dev
```
2. 本地打包插件:
```
npm run build
```
3. 发布到npm:
```
npm publish
```
4. 项目中使用
```
// 安装
npm install dp-placer
// 使用
import DpPlacer from 'dp-placer'
// 初始化
const dpPlacer = new DpPlacer({
    container: containerEl,
    layout: layoutEl,
    item: itemEl
})
// 设置缩放比例
dpPlacer.setZoom(1)
// 监听拖动事件
dpPlacer.on('drag', e => {})
// 监听边框拖动调整尺寸事件
dpPlacer.on('resize', e => {})
```