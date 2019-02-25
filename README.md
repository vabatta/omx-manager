# Development of module omx-manager
  1. [Presentation](#presentation)
  2. [Guidelines](#guidelines)
  3. [Tests](#tests)
  4. [Scripts](#scripts)

<a name="presentation"></a>
## Presentation
From version 0.3.0+ the development of `omx-manager` is done through a strict process for a good
overall code and module quality. <br />
The quality of the module is done by the following:

  * Written in Typescript
  * Standard coding style with StandardJS
  * Well documented code
  * Object-Oriented Programming pattern

All the source code is located inside the `src` folder.

<a name="guidelines"></a>
## Guidelines
  * Typescript code => https://www.typescriptlang.org
  * StandardJS style => https://standardjs.com
  * Linting tool => https://eslint.org
  * Well documented => https://typedoc.org

<a name="tests"></a>
## Tests
The tests are made with [Japa](https://github.com/thetutlage/japa) and [SinonJS](https://sinonjs.org).

<a name="scripts"></a>
## Scripts
The scripts are declared in `package.json` and are runned by `$ npm run <script>` backed by `npx`.

  * `build`: Runs the Typescript compiler
    <!-- * requires `$ npm i -g typescript` -->
  * `test`: Runs the tests
  * `docs`: Runs the tools to output documentation into `docs` folder
    <!-- * requires `$ npm i -g typedoc` -->
