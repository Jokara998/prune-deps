## prune-deps

Prune-deps is a tool used for analyzing the usage of dependencies and pruning unused dependencies in package.json.

## Requirements
* Node >= 16


## Instalation
```
npm install prune-deps
```

## Syntax Support

Depcheck not only recognizes the dependencies in JavaScript files but also supports these syntaxes:

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
Prune-deps supports depcheck config (prune.json file should be provided in the directory where prune-deps is running).

To start using prune-deps, position inside a directory with package.json then run ```prune-deps```.

Select one of two options (View usage of dependencies or prune dependencies):

![Screenshot from 2023-09-26 13-55-33](https://github.com/Jokara998/prune-deps/assets/52428675/8d1978e2-2cb5-43c5-9d21-56b417e2a655)

View usage of dependencies:

![Screenshot from 2023-09-26 13-57-18](https://github.com/Jokara998/prune-deps/assets/52428675/8404e584-7715-4634-a8ba-771171ace467)

Pruning of dependencies:

![Screenshot from 2023-09-26 13-58-01](https://github.com/Jokara998/prune-deps/assets/52428675/d65b3093-8f2a-402c-ab3f-7694e801691d)




## Inspiration
* [npm prune](https://docs.npmjs.com/cli/prune.html) - Remove extraneous packages.
* [depcheck](https://github.com/depcheck/depcheck) - Check your npm module for unused dependencies.
