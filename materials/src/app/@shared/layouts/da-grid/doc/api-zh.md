# 如何使用

在 module 中引入：

```ts
import { DaGridModule } from 'src/app/@shared/layouts/da-grid';
```

在全局样式表 style.css 中引入：

```css
@import 'ng-devui/devui-layout.css';
```

页面中使用：

```html
<!-- 横向布局，da-layout-row布局将使用flex布局，内部可嵌套使用da-layout-col -->
<da-layout-row [daGutter]="0">
  <div></div>
  <da-layout-col></da-layout-col>
</da-layout-row>

<!-- 纵向布局 da-layout-col布局将使用flex布局，内部可嵌套使用da-layout-row -->
<da-layout-col [daGutter]="0">
  <div></div>
  <da-layout-row></da-layout-row>
</da-layout-col>

<!-- 使用间距横向布局，默认间距为12，将只对内部da-layout-col、da-col-item生效 -->
<da-layout-row>
  <da-layout-col></da-layout-col>
  <da-col-item></da-col-item>
</da-layout-row>

<!-- 使用间距纵向布局，默认间距为12，将只对内部da-layout-row、da-row-item生效 -->
<da-layout-col>
  <da-layout-row></da-layout-row>
  <da-row-item></da-row-item>
</da-layout-col>
```

## 布局设计与实现

### da-layout-row

- 横向布局容器，内部支持且仅支持放置`<da-layout-col>、<da-col>`。

### da-layout-col

- 纵向布局容器，内部支持且仅支持放置`<da-layout-row>、<da-row>`。

### da-row

- 纵向布局中行元素，对内部放置内部元素将进行内容投影。

### da-col

- 横向布局中列元素，对内部放置内部元素将进行内容投影。

### 栅格实现

- 基于`devui-layout.css`，为`24`列栅格。

### 响应式实现

- 基于`devui-layout.css`，断点为:
  ` ms: 360px, mm: 768px, ml: 1024px, xs: 1280px, sm: 1440px, md: 1600px, lg: 1760px, xl: 1920px`
  。

- 使用`DaScreenMediaQueryService`监听响应式断点变化。

### 弹性盒实现

- 基于原生`css flex`布局实现，支持响应式。

### 间距 Space 实现

- 容器统一设置子元素间距，纵向布局设置子元素`margin-bottom`，横向布局设置子元素`margin-right`。支持数组参数与响应式。

### styles

- 支持`styles`响应式渲染。

## 参数

以下`{{point}}`代表响应式可选断点值，值为：`Ms | Mn | Ml | Xs | Sm | Md | Lg | Xl`

|         参数         |         类型         | 默认 | 说明                                                       | 支持元素                                               |
| :------------------: | :------------------: | :--: | :--------------------------------------------------------- | :----------------------------------------------------- |
|       daSpace        | `number \| number[]` |  --  | 可选，容器子元素间距，单位`px`，仅对内部 layout 元素生效   | da-layout-row、da-layout-col                           |
|   daSpace{{point}}   | `number \| number[]` |  --  | 可选，不同断点下，容器子元素间距，单位`px`                 | da-layout-row、da-layout-col                           |
|       daGutter       | `number \| number[]` |  --  | 可选，容器子元素内间距，单位`px`，仅对内部 layout 元素生效 | da-layout-row、da-layout-col                           |
|  daGutter{{point}}   | `number \| number[]` |  --  | 可选，不同断点下，容器子元素内间距，单位`px`               | da-layout-row、da-layout-col                           |
|        daFlex        |  `number \| string`  |  --  | 可选，设置元素 flex 属性                                   | da-layout-row、da-layout-col、da-row-item、da-col=item |
|   daFlex{{point}}    |  `number \| string`  |  --  | 可选，不同断点下设置元素 flex 属性                         | da-layout-row、da-layout-col、da-row-item、da-col-item |
|      daJustify       |     `DaJustify`      |  --  | 可选，设置容器子元素主轴对齐方式                           | da-layout-row、da-layout-col                           |
|  daJustify{{point}}  |     `DaJustify`      |  --  | 可选，不同断点下设置容器子元素主轴对齐方式                 | da-layout-row、da-layout-col                           |
|       daAlign        |      `DaAlign`       |  --  | 可选，设置容器子元素交叉轴对齐方式                         | da-layout-row、da-layout-col                           |
|   daAlign{{point}}   |      `DaAlign`       |  --  | 可选，不同断点下设置容器子元素交叉轴对齐方式               | da-layout-row、da-layout-col                           |
|     daAlignSelf      |    `DaAlignSelf`     |  --  | 可选，设置元素基于父元素交叉轴对齐方式                     | da-layout-row、da-layout-col、da-row-item、da-col-item |
| daAlignSelf{{point}} |    `DaAlignSelf`     |  --  | 可选，不同断点下设置元素基于父元素交叉轴对齐方式           | da-layout-row、da-layout-col、da-row-item、da-col-item |
|        daSpan        |       `[0-24]`       |  --  | 可选，设置元素所占栅格份数，0 则当前不显示                 | da-layout-col、da-col-item                             |
|     da{{point}}      |       `[0-24]`       |  --  | 可选，设置不同断点下元素所占栅格份数，0 则当前不显示       | da-layout-col、da-col-item                             |
|       daOffset       |       `[0-24]`       |  --  | 可选，设置元素前所需间距所占栅格份数                       | da-layout-col、da-col-item                             |
|  daOffset{{point}}   |       `[0-24]`       |  --  | 可选，设置不同断点下元素前所需间距所占栅格份数             | da-layout-col、da-col-item                             |
|       daOrder        |       `[0-24]`       |  --  | 可选，设置当前子元素 order                                 | da-row-item、da-col-item                               |
|   daOrder{{point}}   |       `[0-24]`       |  --  | 可选，设置不同断点下元素 order                             | da-row-item、da-col-item                               |
|       daStyle        |       `Object`       |  --  | 可选，设置元素 style                                       | 所有元素                                               |
|   daStyle{{point}}   |       `Object`       |  --  | 可选，设置不同断点下元素 style                             | 所有元素                                               |

#### _daFlex 参数说明_

1. 具体宽度如`300px`，则为当前元素宽度设置为`300px`，同 css flex 属性设置为`0 0 300px`;
2. 具体数字如`1`，则为当前元素缩放权重为`1`，同 css flex 属性设置为`1 1 auto`;
3. 传入其他字符串如`1 2 200px`,则当前字符串将直接用于设置当前元素 css flex 属性。

#### _daStyle 参数说明_

1. 接收`css`样式类进行渲染；
2. 非全量覆盖，同一名称属性互斥，如`daStyleSm={"background": "#000", "color": "#fff"}, daStyleMd={"background": "#0f0"}`, 若当前屏宽生效断点为 md，那么最终将生效并渲染到元素上的样式为：`{"background": "#0f0", "color": "#fff"}`

### Types

```TS
// 以下分别对应于css flex justify-content属性的flex-start、flex-end、center、space-between、space-around
type DaJustify = 'start' | 'end' | 'center' | 'around' | 'between';

// 以下分别对应于css flex align-items属性的flex-start、center、flex-end、baseline、stretch
type DaAlign = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

// 以下分别对应于css flex align-self属性的flex-start、center、flex-end、baseline、stretch
type DaAlignSelf = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

type DaBreakpoint = 'ms' | 'mm' | 'ml' | 'xs' | 'sm' | 'md' | 'lg'| 'xl';
const DaBreakpoints = ['ss', 'ms', 'mm', 'ml', 'xs', 'sm', 'md', 'lg', 'xl'];
const DaBreakpointsMap = {
  'ss': 0,
  'ms': 360,
  'mm': 768,
  'ml': 1024,
  'xs': 1280,
  'sm': 1440,
  'md': 1600,
  'lg': 1760,
  'xl': 1920
};
```

### DaScreenMediaQueryService

#### 作用

- 监听屏幕媒体属性变化。

#### 注入方式

- `providedIn: 'root'`

#### 对外方法

```TS
// 获取当前断点，可订阅此函数返回subject，监听断点变化，change标识断点相对于上一个断点变化趋势，compare标识断点相对于basePoint变化趋势
public getPoint(): ReplaySubject<{ currentPoint: DaBreakpoint, change: number, compare: { [key: string]: number } }>;
```

#### 使用示例

```TS
import { DaScreenMediaQueryService } from 'src/app/@shared/layouts/da-grid';
…………
export class XXXComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private screenQueryService: DaScreenMediaQueryService
  ) { }

  ngOnInit(): void {
    this.screenQueryService.getPoint()
    .pipe(takeUntil(this.destroy$))
    .subscribe(({ currentPoint: DaBreakpoint, change: number, compare: { [key: string]: number } }) => {
      console.log(currentPoint, change, compare);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```
