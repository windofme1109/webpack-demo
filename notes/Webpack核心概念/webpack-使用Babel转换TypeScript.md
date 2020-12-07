<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [使用 Babel 转换 TypeScript](#%E4%BD%BF%E7%94%A8-babel-%E8%BD%AC%E6%8D%A2-typescript)
  - [1. 基本概念](#1-%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
  - [2. 安装](#2-%E5%AE%89%E8%A3%85)
  - [3. 配置](#3-%E9%85%8D%E7%BD%AE)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 使用 Babel 转换 TypeScript

## 1. 基本概念

1. Babel 使用 `@babel/preset-typescript` 完成对 
TypeScript 的转换。实际上，是将 TS 代码 转换为 ES6 代码，举例如下：
   - TS 代码：
     `const x: number = 10;`
   - 转换后的 ES6 代码：
     `const x = 10;`
   
2. 应该将这个 `@babel/preset-typescript` 插件放在 `@babel/preset-env` 的后面。

3. 参考文档：[@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)

## 2. 安装

1. 安装命令如下：
   - `npm install --save-dev @babel/preset-typescript`
   
## 3. 配置

1. 在 `.babelrc` 或者 `babel.config.json` 中，配置如下：
   ```json
      {
        "presets": ["@babel/preset-typescript"]
      }
   ```
   注意，`@babel/preset-typescript` 这个插件要放在`@babel/preset-env` 的后面。
   
2. 配置项说明
   - `isTSX` 布尔值，默认为 `false`，这个配置项的作用是强制启用 JSX 解析，否则会将尖括号 `<>` 看作 TS 的过时的类型断言：`var foo = <string>bar;`。如果设置 `isTSX` 为 `true`，则 `allExtensions` 也必须为 `true`。
   - `jsxPragma` 字符串，默认为 `react`。替换编译 JSX 表达式的时候使用函数。这样我们就知道导入（`import`）不是类型导入，不应该被移除。
   - `allExtensions` 布尔值，默认为 `false`，设置为 `true` 表示每个文件作为 TS 或者 TSX 格式解析。
   - `allowNamespaces` 布尔值，作用是启用对 TS 的命名空间（`namespace`）的编译。要和 `@babel/plugin-transform-typescript` 插件配合使用。在 Babel 的 `v7.6.0` 版本中引入。
   - `allowDeclareFields` 布尔值，默认为 `false`。在 Babel 的 `v7.7.0` 版本中引入。设置为 `true` 的时候，使用 `declare` 声明的类变量会被移除。示例如下：
     ```typescript
          class A {
            declare foo: string; // Removed
            bar: string; // Initialized to undefined
            prop?: string; // Initialized to undefined
            prop1!: string // Initialized to undefined
          }
     ```
   注意：这个配置项在 Babel 8 中会被默认启用。
   - `onlyRemoveTypeImports` 布尔值，默认为 `false`。这个配置项的作用是只移除 `type-only` 类型的导入（`import`）。当我们使用 TypeScript >= 3.8 版本才可以使用这个配置项。   `type-only imports` 说明：[ type-only imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-exports)
