## prune-deps

Prune-deps is a tool used for analying usage of dependencies and pruning unused dependencies in package.json.

## Requirements
* Node >= 10


## Instalation
``` bash
$ npm install prune-deps
```

## Syntax Support

Depcheck not only recognizes the dependencies in JavaScript files, but also supports these syntaxes:

- JavaScript (ES5, ES6 and ES7)
- [React JSX](http://facebook.github.io/react/docs/jsx-in-depth.html)
- [CoffeeScript](http://coffeescript.org/)
- [TypeScript](http://www.typescriptlang.org/) (with `typescript` dependency)
- [SASS and SCSS](http://sass-lang.com/)
- [Vue.js](https://vuejs.org/) (with `@vue/compiler-sfc` dependency)

To get the syntax support by external dependency, please install the corresponding package explicitly. For example, for TypeScript user, install depcheck with `typescript` package:

```
npm install -g depcheck typescript
```

## Usage


## Inspiration
* [npm prune](https://docs.npmjs.com/cli/prune.html) - Remove extraneous packages.
* [depcheck](https://github.com/depcheck/depcheck) - Check your npm module for unused dependencies.