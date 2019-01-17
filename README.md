[toc]
# webpack4-study
Record the code that [learn webpack4](http://note.youdao.com/noteshare?id=e226a7c356581c5628b271bc39a5773d)



webpack 用于编译 JavaScript 模块。

本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

本文是学习 [webpack 中文网](https://www.webpackjs.com/) 所做笔记。

## 安装

webpack 的使用是基于 Node 和 NPM 的。

### 前提条件

在开始之前，请确保安装了 Node.js 的最新版本。使用 Node.js 最新的长期支持版本(LTS - Long Term Support)，是理想的起步。使用旧版本，你可能遇到各种问题，因为它们可能缺少 webpack 功能以及/或者缺少相关 package 包。


### 基本安装

首先我们创建一个目录，初始化 npm，然后 在本地安装 webpack，接着安装 webpack-cli（此工具用于在命令行中运行 webpack）：
```
mkdir webpack-start && cd webpack-start
npm init -y
npm install webpack webpack-cli --save-dev
```

另外，我们还需要调整 package.json 文件，以便确保我们安装包是 **私有的** (private)，并且移除 main 入口。这可以防止意外发布你的代码。

package.json
```
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
+   "private": true,
-   "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9"
    },
    "dependencies": {}
  }
```

现在可以开始你的模块化项目了~

项目结构大概是这样的：
```
webpack-start
|- /dist
  |- bundle.js
  |- index.html
|- /node_modules
|- /src
  |- index.js
|- package-lock.json
|- package.json
|- webpack.config.js
```

完整 demo 文件可在 webpack-study 中的 webpack-start 文件夹查看

## 使用下一代 ECMAScript

本节内容沿用 webpack-start 文件代码。

通过在 webpack 中配置 babel，使用下一代 ECMAScript。

```
npm install babel-loader  @babel/core  @babel/preset-env --save-dev
```

安装之后，修改配置文件 **webpack.config.js** ：
```
const path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
   module: {
     rules: [
+      {
+        test: /\.js$/,
+        exclude: /node_modules/,
+        use: {
+          loader: 'babel-loader',
+        }
+      }
     ]
   }
};
```

这样就可以在项目中使用下一代 ECMAScript 语法规则。

但是 babel 默认只转换语法，而不转换新的 API，如需使用新的 API，还需要使用对应的转换插件 **或者** 添加 polyfill。

###  使用转换插件

转换插件适合在组件，类库项目中使用。

添加转换插件：
```
npm install @babel/plugin-transform-runtime --save-dev
 
npm install --save @babel/runtime-corejs2
```
@babel/runtime-corejs2 可转换 Promise 在 IE 中未定义的问题。

创建 babel 配置文件 *.babelrc*：
```
{
    "presets": [
        ["@babel/preset-env"]
      ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": 2,
          "helpers": true,
          "regenerator": true,
          "useESModules": false
        }
      ]
    ]
  }
```

完整 demo 文件可在 webpack-study 中的 webpack-ES6/ES6-runtime 文件夹查看。

###  使用 @babel/polyfill

@babel/polyfill 适合在业务项目中使用。

添加 polyfill 到生产环境：
```
npm install --save @babel/polyfill
```

创建 babel 配置文件 *.babelrc*：
```
{
    "presets": [
      ["@babel/preset-env",
        {
          "useBuiltIns": "usage"
        }
      ]
    ]
}
```
在 **.babelrc** 中指定 `useBuiltIns: 'usage'` 的话，就不用在 **webpack.config.js** 的 entry 中包含 @babel/polyfill。

现在你可以在项目中使用新的语法规则和新的 API 了。


> babel 文档： https://babel.docschina.org/docs/en/usage

> babel 教程：https://blog.zfanw.com/babel-js/

完整 demo 文件可在 webpack-study 中的 webpack-ES6/ES6-polyfill 文件夹查看。

## 资源管理

webpack 最出色的功能之一就是，除了 JavaScript，还可以通过 loader 引入任何其他类型的文件。

也就是说，以上列出的那些 JavaScript 的优点（例如显式依赖），同样可以用来构建网站或 web 应用程序中的所有非 JavaScript 内容。

### 加载 CSS

#### 使用 style-loader 和 css-loader

为了从 JavaScript 模块中 import 一个 CSS 文件，你需要在 module 配置中 安装并添加 style-loader 和 css-loader：
```
npm install --save-dev style-loader css-loader
```

然后再 webpack.config.js 文件中：
```
  const path = require('path');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         exclude: /node_modules/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```
webpack 根据正则表达式，来确定应该查找哪些文件，并将其提供给指定的 loader。在这种情况下，以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。

这使你可以在依赖于样式的文件中引入样式文件 `import './style.css'`。

现在，当该模块运行时，含有 CSS 字符串的 `<style>` 标签，将被插入到 html 文件的 `<head>` 中。

#### 使用 CSS Module


只要在 webpack.config.js 文件中修改：
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
-           'css-loader',
+          { loader: 'css-loader', options: { modules: true, localIdentName: '[name]__[local]-[hash:base64:5]' } }
        ]
      }
    ]
  },
};
```

使用 css module 后，在页面引用样式需要修改：

src/index.js
```
import style from "./style.css";

function component() {
  var element = document.createElement("div");

  element.innerHTML = "Asset management";
- element.classList.add('hello');
+ element.classList.add(style.hello);

  return element;
}

document.body.appendChild(component());
```

重新打包，就能看到 calss 名称已经变成类似 `style__hello-2uDIX` 了。

#### 使用 PostCSS

PostCSS 本身是一个功能比较单一的工具。它提供了一种方式用 JavaScript 代码来处理 CSS。它负责把 CSS 代码解析成抽象语法树结构（Abstract Syntax Tree，AST），再交由插件来进行处理。

插件基于 CSS 代码的 AST 所能进行的操作是多种多样的，比如可以支持变量和混入（mixin），增加浏览器相关的声明前缀，或是把使用将来的 CSS 规范的样式规则转译（transpile）成当前的 CSS 规范支持的格式。

PostCSS 一般不单独使用，而是与已有的构建工具进行集成。PostCSS 与主流的构建工具，如 Webpack、Grunt 和 Gulp 都可以进行集成。完成集成之后，选择满足功能需求的 PostCSS 插件并进行配置。

文档地址：https://postcss.org/

中文文档：https://www.postcss.com.cn/

IBM文档：https://www.ibm.com/developerworks/cn/web/1604-postcss-css/

学习指南：https://webdesign.tutsplus.com/series/postcss-deep-dive--cms-889


安装 PostCSS 并添加插件 autoprefixer 和 postcss-preset-env：
```
 npm i -D postcss-loader postcss-preset-env autoprefixer   
```

在 webpack.config.js 文件中添加：
```
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { modules: true, localIdentName: '[name]__[local]-[hash:base64:5]' } },
+         {
+           loader: 'postcss-loader',
+           options: {
+             ident: 'postcss',
+             plugins: [
+               require('autoprefixer')(),
+               require('postcss-preset-env')(),
+             ]
+           }
+         }
        ]
      }
    ]
  },
};
```

完整 demo 文件可在 webpack-study 中的 asset-management/css-management 文件夹查看。

### 加载图片



#### 使用 file-loader

使用 file-loader，我们可以轻松地将图片和 icon 混合到 CSS 中：
```
npm install --save-dev file-loader
```

webpack.config.js
```
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true, localIdentName: "[name]__[local]-[hash:base64:5]" } },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")(), require("postcss-preset-env")()]
            }
          }
        ]
      },
+     {
+       test: /\.(png|svg|jpg|gif)$/,
+       use: ["file-loader"]
+     }
    ]
  }
};

```

现在可以在页面（或者 css）中使用 图片和 icon 了。

现在，当你 `import MyImage from './my-image.png'`，该图像将被处理并添加到 output 目录，_并且_ `MyImage` 变量将包含该图像在处理后的最终 url。

当使用 css-loader 时，你的 CSS 中的 `url('./my-image.png')` 会使用类似的过程去处理。loader 会识别这是一个本地文件，并将 `'./my-image.png'` 路径，替换为输出目录中图像的最终路径。

合乎逻辑下一步是，压缩和优化你的图像。

#### 使用 url-loader 和  image-webpack-loader

url-loader 功能类似于 file-loader，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。

image-webpack-loader 使用 imagemin 压缩 PNG, JPEG, GIF, SVG 和 WEBP 图像。

```
npm install --save-dev image-webpack-loader url-loader
```

webpack.config.js
```
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true, localIdentName: "[name]__[local]-[hash:base64:5]" } },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")(), require("postcss-preset-env")()]
            }
          }
        ]
      },
-     {
-       test: /\.(png|svg|jpg|gif)$/,
-       use: ["file-loader"]
-     },
+     {
+       test: /\.(png|svg|jpg|gif)$/,
+       use: [
+         {
+           loader: "url-loader",
+           options: {
+             limit: 8192,
+             name: 'images/[name]-[hash:5].[ext]'
+           }
+         },
+         "image-webpack-loader"
+       ]
+     }
    ]
  }
};

```

完整 demo 文件可在 webpack-study 中的 asset-management/iamge-management 文件夹查看。

### 加载字体

那么，像字体这样的其他资源如何处理呢？

file-loader 和 url-loader 可以接收并加载任何文件，然后将其输出到构建目录。这就是说，我们可以将它们用于任何类型的文件，包括字体。让我们更新 webpack.config.js 来处理字体文件：
```
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true, localIdentName: "[name]__[local]-[hash:base64:5]" } },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")(), require("postcss-preset-env")()]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: 'images/[name]-[hash:5].[ext]'
            }
          },
          "image-webpack-loader"
        ]
      },
+     {
+       test: /\.(woff|woff2|eot|ttf|otf)$/,
+       use: [
+         'url-loader'
+       ]
+     }
    ]
  }
};

```
完整 demo 文件可在 webpack-study 中的 asset-management/font-management 文件夹查看。

### 加载 Iconfont

Iconfont 本质上就是字体文件，只要 *webpack.config.js* 具有在 **加载CSS** 和 **加载字体** 添加的 rules，就能加载 Iconfont。

在需要的页面引入 *iconfont.css* 文件就能使用 Iconfont：
```
import Iconfont from "./asset/font/iconfont.css";

...

// 将图像添加到我们现有的 div。
var myIcon = document.createElement("span");;
myIcon.classList.add(Iconfont.iconfont);
myIcon.classList.add(Iconfont['wx-manage-shipin1']);
```

完整 demo 文件可在 webpack-study 中的 asset-management/font-management 文件夹查看。


### 加载数据

此外，可以加载的有用资源还有数据，如 JSON 文件，CSV、TSV 和 XML。

类似于 NodeJS，JSON 支持实际上是内置的，也就是说 import Data from './data.json' 默认将正常运行。

要导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。让我们处理这三类文件：
```
npm install --save-dev csv-loader xml-loader
```

webpack.config.js
```
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { modules: true, localIdentName: "[name]__[local]-[hash:base64:5]" } },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")(), require("postcss-preset-env")()]
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: 'images/[name]-[hash:5].[ext]'
            }
          },
          "image-webpack-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'url-loader'
        ]
      },
+     {
+       test: /\.(csv|tsv)$/,
+       use: [
+         'csv-loader'
+       ]
+     },
+     {
+       test: /\.xml$/,
+       use: [
+         'xml-loader'
+       ]
+     }
    ]
  }
};

```

完整 demo 文件可在 webpack-study 中的 asset-management/data-management 文件夹查看。

### 全局资源

上述所有内容中最出色之处是，以这种方式加载资源，你可以以更直观的方式将模块和资源组合在一起。

无需依赖于含有全部资源的 /assets 目录，而是将资源与代码组合在一起。
```
- |- /assets
+ |– /components
+ |  |– /my-component
+ |  |  |– index.jsx
+ |  |  |– index.css
+ |  |  |– icon.svg
+ |  |  |– img.png
```

这种配置方式会使你的代码更具备可移植性，因为现有的统一放置的方式会造成所有资源紧密耦合在一起。假如你想在另一个项目中使用 /my-component，只需将其复制或移动到 /components 目录下。

只要你已经安装了任何扩展依赖(external dependencies)，并且你已经在配置中定义过相同的 loader，那么项目应该能够良好运行。

但是，假如你无法使用新的开发方式，只能被固定于旧有开发方式，或者你有一些在多个组件（视图、模板、模块等）之间共享的资源。你仍然可以将这些资源存储在公共目录(base directory)中，甚至配合使用 alias 来使它们更方便 import 导入。

接下来我们改造 **data-management** 项目中的文件。

完成 **加载数据** 这一小节后，我们的项目目录大概是：
```
data-management
|- /dist
  |- /images
  |- bundle.js
  |- index.html
|- /node_modules
|- /src
  |- /asset
    |- /font
  |- data.xml
  |- icon.jpg
  |- index.js
  |- style.css
|- package-lock.json
|- package.json
|- webpack.config.js
```

按照上述原则改造如下：
1. 在 **~/src** 文件夹下新建文件夹 **components**，用于存放我们所有的组件。
2. 在 **components** 文件夹下新建 **hello-world** 文件夹，用于存放我们的第一个组件。
3. 把存在 **~/src** 目录下的文件 *data.xml*、*icon.jpg*、*index.js*、*style.css* 移动到 **hello-world** 文件夹。并修改 *index.js* 文件：
    ```
        import style from "./style.css";
    -   import Iconfont from "./asset/font/iconfont.css";
    +   import Iconfont from "../../asset/font/iconfont.css";
        import Icon from "./icon.jpg";
        import Data from './data.xml';
        
        console.log("Data",Data)
        function component() {
          let element = document.createElement("div");
        
          element.innerHTML = "Asset management";
          element.classList.add(style.hello);
        
          return element;
        }
        
        function imageComponent() {
          let element = document.createElement("div");
        
          // 将图像添加到我们现有的 div。
          let myIcon = new Image();
           myIcon.src = Icon;
        
           element.appendChild(myIcon);
        
          return element;
        }
        
        function iconComponent() {
          let element = document.createElement("div");
        
          // 将图像添加到我们现有的 div。
          let myIcon = document.createElement("span");;
           myIcon.classList.add(Iconfont.iconfont);
           myIcon.classList.add(Iconfont['wx-manage-shipin1']);
        
           element.appendChild(myIcon);
        
          return element;
        }
        
        function dataComponent() {
          let element = document.createElement("div");
          let str = '';
           
          for(let key in Data.note){
            str += `<p>${key}：${Data.note[key][0]}</p>`
          }
          element.innerHTML = str;
         
          return element;
        }
    -    document.body.appendChild(component());
    -    document.body.appendChild(imageComponent());
    -    document.body.appendChild(iconComponent());
    -    document.body.appendChild(dataComponent());
        
    +   export {
    +     component,
    +     imageComponent,
    +     iconComponent,
    +     dataComponent
    +   }

    ```
4. 在 **~/src** 文件夹下新建文件 *index.js*（原来的已经移入 **hello-world** 文件夹），并添加内容：
    ```
    import { component,imageComponent,iconComponent,dataComponent} from "./components/hello-world/index.js";

    document.body.appendChild(component());
    document.body.appendChild(imageComponent());
    document.body.appendChild(iconComponent());
    document.body.appendChild(dataComponent());
    ```

调整完成后我们的项目结构大概是：
```
data-management
|- /dist
  |- /images
  |- bundle.js
  |- index.html
|- /node_modules
|- /src
  |- /asset
    |- /font
  |- /components
    |- /hello-world
  |- index.js
|- package-lock.json
|- package.json
|- webpack.config.js
```
这里的 **~/src/asset** 文件夹依然存在，它存放的是 Iconfont 文件，这在我们的整个项目中都会用到。当然也可以拆分到具体的组件，从而实现完全没有全局资源。

## 输出管理

本节代码沿用 **资源管理** 代码并安装配置好 babel 和 @babel/polyfill。

项目结构大概是这样的：
```
output-management
|- /dist
  |- /images
  |- bundle.js
  |- index.html
|- /node_modules
|- /src
  |- /asset
    |- /font
  |- /components
    |- /hello-world
  |- index.js
|- .babelrc
|- package-lock.json
|- package.json
|- webpack.config.js
```

### 使用 HtmlWebpackPlugin 

从本文开始到现在，我们项目下几乎所有的文件都动过，除了 **~/dist/index.html** 这个文件。

用过主流框架的同学的知道， ~/dist 目录下的所有文件都会打包后重新生成。我们通过 HtmlWebpackPlugin 插件来完成这项任务。

#### 生成 index.html

安装插件：
```
npm install --save-dev html-webpack-plugin
```

并在配置文件 *webpack.config.js* 中引入并配置：
```
    const path = require("path");
+   const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    module.exports = {
      
      ...
      
+     plugins: [
+       new HtmlWebpackPlugin({
+         title: 'Output Management'
+       })
+     ],

      ...
      
    };

```

配置完成后，执行打包命令 `npm run dev`，就会根据配置生成一个 index.html 文件:
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Output Management</title>
  </head>
  <body>
  <script type="text/javascript" src="index.js"></script></body>
</html>
```

#### 分离入口

现在我们的 ~/src 文件夹下只有一个入口文件 index.js，如果存在多个怎么添加进生成的 index.html 文件呢？

首先，在 ~/src 文件夹下新建入口文件 print.js，添加下面内容：
```
function component() {
    let element = document.createElement("div");
  
    element.innerHTML = "print entry";
  
    return element;
  }

  document.body.appendChild(component());
```

然后修改配置文件 *webpack.config.js* ：
```
    const path = require("path");
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    
    module.exports = {
-     entry: "./src/index.js",
+     entry: {
+       app: "./src/index.js",
+       print: "./src/print.js"
+     },
      output: {
-       filename: 'index.js',
+       filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
      },
      
      ...
      
    };
```


执行打包命令，在重新生成的 index.html 中就添加了多个入口文件：
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Output Management</title>
  </head>
  <body>
  <script type="text/javascript" src="app.bundle.js"></script><script type="text/javascript" src="print.bundle.js"></script></body>
</html>
```

### 清理 ~/dist 文件夹

在上一节的操作中，我们成功的让 webpack 可以比较智能的完成了一些任务，很开心~

然而，当我打开 ~/dist 文件夹时却发现里面的文件非常杂乱，因为我们每次构建都会生成相应代码，但是从来没有清理。

幸运的是，我们可以通过 **clean-webpack-plugin** 插件在构建前清理 /dist 文件夹。

安装插件：
```
npm install clean-webpack-plugin --save-dev
```

并在改配置文件 *webpack.config.js* 中引入和配置：
```
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      print: './src/print.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
    plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
    
    ...
    
  };
```

现在再次执行 `npm run build` 将会发现以前生成的文件已经被清理干净了！

完整 demo 可在 output-management 文件夹查看。

## 搭建开发环境

如果你一直跟随之前的指南，应该对一些 webpack 基础知识有着很扎实的理解。在我们继续之前，先来看看如何建立一个开发环境，使我们的开发变得更容易一些。

### 使用 source map

本小节沿用 **输出管理** 这一节的代码。

当 webpack 打包源代码时，可能会很难追踪到错误和警告在源代码中的原始位置。例如，如果将三个源文件（a.js, b.js 和 c.js）打包到一个 bundle（bundle.js）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会简单地指向到 bundle.js。这并通常没有太多帮助，因为你可能需要准确地知道错误来自于哪个源文件。

为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。如果一个错误来自于 b.js，source map 就会明确的告诉你。

source map 有很多 [不同的选项](https://www.webpackjs.com/configuration/devtool/) 可用，请务必仔细阅读它们，以便可以根据需要进行配置。

简单的说，在开发环境可以使用 `"eval"` 选项因为它很快；在生产环境，最好 **不用** 或者使用 `"source-map"` 选项。

修改配置文件 **webpack.config.js** 使用 source map：
```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {

  ...

+ devtool: "eval",
  
  ...
  
};

```

然后再 print.js 文件中人为的制造一个错误：
```
    function component() {
        let element = document.createElement("div");
      
        element.innerHTML = "print entry";
+       console.lag("asd",asdasd);
      
        return element;
      }
    
    document.body.appendChild(component());
```

执行构建 `npm run build` 后，在浏览器打开 ~/build/index.html 文件，控制台就会输出一个错误：
```
print.js:4 Uncaught ReferenceError: asdasd is not defined
    at component (print.js:4)
    at eval (print.js:8)
    at Object../src/print.js (print.bundle.js:96)
    at __webpack_require__ (print.bundle.js:20)
    at print.bundle.js:84
    at print.bundle.js:87
```

告诉我们错误的文件是 `"print.js"`，行数为 4 。

行数是错的，实际在第 5 行，使用 `"source-map"` 选项的话，就是正确的：
```
print.js:5 Uncaught ReferenceError: asdasd is not defined
    at component (print.js:5)
    at Object../src/print.js (print.js:10)
    at __webpack_require__ (bootstrap:19)
    at bootstrap:83
    at bootstrap:83
```

完整 demo 可在 webpack-dev/source-map 文件夹查看。

### 使用一个开发工具

现在，我们每次需要执行构建的时候，都需要手动运行 npm run build 命令，这有时会让我们感到很烦躁~

webpack 中有几个不同的选项，可以帮助我们在代码发生变化后自动编译代码：

- webpack's Watch Mode
- webpack-dev-server
- webpack-dev-middleware

我们只需要使用其中之一，就能去掉我们的烦恼  \^_^

**注意**：本小节每一个选项都沿用上一小节 **使用 source map** 的代码。

#### 使用观察模式

使用观察模式后，如果项目其中有文件被更新，代码将被重新编译，所以你不必手动运行整个构建。

我们添加一个用于启动 webpack 的观察模式的 `npm script` 脚本：
```
   "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "watch": "webpack --watch",
      "build": "webpack"
    },
```

在命令行中运行 `npm run watch`，就会看到 webpack 编译代码，然而却不会退出命令行。这是因为 script 脚本还在观察文件。

现在，我们先移除我们之前引入的错误：

src/print.js
```
    function component() {
        let element = document.createElement("div");
      
        element.innerHTML = "print entry";
-       console.lag("asd",asdasd);
      
        return element;
      }
    
    document.body.appendChild(component());
```
保存文件并检查终端窗口。应该可以看到 webpack 自动重新编译修改后的模块！

唯一的缺点是，为了看到修改后的实际效果，你需要自己刷新浏览器。

完整 demo 可在 webpack-dev/webpack-watch 文件夹查看。

#### 使用 webpack-dev-server

webpack-dev-server 为你提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)。

##### 安装并使用

首先，安装：
```
npm install --save-dev webpack-dev-server
```

然后修改配置文件，告诉开发服务器(dev server)，在哪里查找文件：
```
    const path = require("path");
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    
    
    module.exports = {
      entry: {
        app: "./src/index.js",
        print: "./src/print.js"
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
      },
      devtool: "source-map",
+     devServer: {
+       contentBase: "./dist"
+     },
      
      ...
      
    };
```


然后在 package.json 文件中添加一个 script 脚本，来启用开发服务器：
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
+   "start": "webpack-dev-server --open"
  },
```

现在，我们可以在命令行中运行 `npm start`，就会看到浏览器自动加载页面。

如果现在修改和保存任意源文件，web 服务器就会自动重新加载编译后的代码。试一下！

可以查看 [相关文档](https://www.webpackjs.com/configuration/dev-server/) 了解更多关于 devServer 的配置。

完整 demo 可在 webpack-dev/dev-server/webpack-WDS 文件夹查看。

##### 启用模块热替换

模块热替换(Hot Module Replacement 或 HMR)是 webpack 提供的最有用的功能之一。它允许在运行时更新各种模块，而无需进行完全刷新。

配置 webpack.config.js 文件：
```
    const path = require("path");
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
+   const webpack = require('webpack');
    
    module.exports = {
      entry: {
        app: "./src/index.js",
        print: "./src/print.js"
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist")
      },
      devtool: "source-map",
      devServer: {
        contentBase: "./dist",
+       hot: true
      },
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Output Management'
        }),
+       new webpack.NamedModulesPlugin(),
+       new webpack.HotModuleReplacementPlugin()
      ],
      
      ...
      
      
    };

```


在入口文件 ~/src/index.js 处理模块的热替换：
```
    import { component,imageComponent,iconComponent,dataComponent} from "./components/hello-world/index.js";


-   document.body.appendChild(component());
    document.body.appendChild(imageComponent());
    document.body.appendChild(iconComponent());
    document.body.appendChild(dataComponent());
    
+   let element = component();   // 记录模块，方便更新时移除和替换
+   document.body.appendChild(element);

+   
+    if (module.hot) {
+      module.hot.accept('./components/hello-world/index.js', function() {
+        console.log('Accepting the updated printMe module!');
+   
+        document.body.removeChild(element);
+        element = component();   // 重新渲染页面后，更新 component 模块
+        document.body.appendChild(element);
       })
     }
```

然后运行 `npm start` 启动项目，修改 component 模块内容：

./components/hello-world/index.js
```

    ...
    
    function component() {
      let element = document.createElement("div");
      
-     element.innerHTML = "Asset management";
+     element.innerHTML = "Asset management HMR";
      element.classList.add(style.hello);
    
      return element;
    }
    
    ...

```
保存文件，可以看到 web 服务器就会自动编译代码，然后替换浏览器中的相应模块。

完整 demo 可在 webpack-dev/dev-server/WDS-HMR 文件夹查看。

##### HMR 修改样式表

当项目中配置了 style-loader 和 css-loader，项目就能模块热替换样式表，无需自己再做任何配置。


#### 使用 webpack-dev-middleware

webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。 

webpack-dev-server 在内部使用了它，同时，它也可以作为一个单独的包来使用，以便进行更多自定义设置来实现更多的需求。


接下来是一个 webpack-dev-middleware 配合 express server 的示例。

##### 启用 webpack-dev-middleware

首先，安装 express 和 webpack-dev-middleware：
```
npm install --save-dev express webpack-dev-middleware
```

接下来我们需要对 webpack 的配置文件 *webpack.config.js* 做一些调整，以确保中间件(middleware)功能能够正确启用：
```
    const path = require("path");
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    
    
    module.exports = {
      entry: {
        app: "./src/index.js",
        print: "./src/print.js"
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
+       publicPath: '/'
      },
      devtool: "source-map",
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Output Management'
        })
      ],
      module: { ···
      }
    };
```
`publicPath` 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问，我们稍后再设置端口号。

下一步就是设置我们自定义的 express 服务：

在项目文件夹 **webpack-middleware** 下新建文件 *server.js*：
```
    |- /dist
    |- /node_modules
    |- /src
      |- /asset
      |- /components
        |- /hello-world
      |- index.js
      |- print.js
    |- .babelrc
    |- package-lock.json
    |- package.json
    |- webpack.config.js
+   |- server.js
```

在 **server.js** 添加下列内容：
```
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

接着，在 **package.json** 添加一个 `script`，方便我们运行服务：
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
+   "server": "node server.js"
  },
```

添加完成后就可以执行 `npm run server` 命令运行程序。
```
PS F:\demo\webpack-study\webpack-dev\webpack-middleware> npm run server

> webpack-study@1.0.0 server F:\demo\webpack-study\webpack-dev\webpack-middleware
> node server.js

clean-webpack-plugin: F:\demo\webpack-study\webpack-dev\webpack-middleware\dist has been removed.
Example app listening on port 3000!
```

打开浏览器并输入 `http://localhost:3000`，就能看到看到页面。

当项目中的文件存在修改，在保存后 webpack 就会自动编译文件，刷新浏览器就可以看到编译后的文件。

完整 demo 可在 webpack-dev/dev-middleware/webpack-middleware 文件夹查看。

##### 使用 webpack-hot-middleware

我们知道如果只使用 webpack-dev-middleware 的话，我们必须自己刷新浏览器，那么能不能自动刷新呢？答案当然是可以！

通过使用 [webpack-hot-middleware](https://github.com/webpack-contrib/webpack-hot-middleware) 让浏览器自动刷新：
```
npm install --save-dev webpack-hot-middleware
```

安装完成后修改配置文件：
```
    const path = require("path");
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
+   const webpack = require('webpack');
    
    module.exports = {
      entry: {
-       app: "./src/index.js",
-       print: "./src/print.js"
+       app: ["./src/index.js",'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true&name=app'],
+       print: ["./src/print.js",'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true&name=print']
      },
      output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
        publicPath: '/'
      },
      devtool: "source-map",
      plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
          title: 'Output Management'
        }),
+       new webpack.optimize.OccurrenceOrderPlugin(),
+       new webpack.HotModuleReplacementPlugin(),
+       new webpack.NoEmitOnErrorsPlugin()
      ],
      module: { ···
      }
    };


```
在 **server.js** 中添加：
```
    const express = require('express');
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    
    const app = express();
    const config = require('./webpack.config.js');
    const compiler = webpack(config);
    
    // Tell express to use the webpack-dev-middleware and use the webpack.config.js
    // configuration file as a base.
    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    }));
    
+   app.use(require("webpack-hot-middleware")(compiler, {
+     log: false,
+     heartbeat: 1000,
+   }));
    
    // Serve the files on port 3000.
    app.listen(3000, function () {
      console.log('Example app listening on port 3000!\n');
    });
```

启动开发服务器 `npm run server`，再修改项目下的文件并保存，就能看到浏览器已经可以自动刷新了。

完整 demo 可在 webpack-dev/dev-middleware/hot-middleware 文件夹查看。


## 优化

到目前为止，已经完成了基础部分的学习~




## 学习资料

https://www.webpackjs.com/guides/hot-module-replacement/
