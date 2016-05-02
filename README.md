# Development of module omx-manager
  1. [Presentation](#presentation)
  2. [Guidelines](#guidelines)
  3. [Tests](#tests)
  4. [Scripts](#scripts)

<a name="presentation"></a>
## Presentation
The development of version >= 0.1.0 of `omx-manager` is done through a strictly process for a good overall module quality. <br />
Built with the future in mind, the quality of the module is done by the following:

  * Javascript coding standard
  * Strongly-typed code
  * Clean code by linting it
  * Well documented
  * ES6 syntax and Object-Oriented Programming

All the code is written inside `src` folder, then compiled to respective sub-folders in the root.

<a name="guidelines"></a>
## Guidelines
  * Javascript standard coding style => rules http://standardjs.com/ and style https://github.com/airbnb/javascript
  * Strongly-typed code => http://flowtype.org/
  * Clean code by linting it => http://eslint.org/
  * Well documented => style http://usejsdoc.org/ and output http://documentation.js.org/
  * ES6 syntax and Object-Oriented Programming => https://babeljs.io/

<a name="tests"></a>
## Tests
The tests are made with [chaijs](http://chaijs.com/) and [mocha](http://mochajs.org/).

<a name="scripts"></a>
## Scripts
The following scripts (available through `package.json`) serves to work with the code `$ npm run <script>`

  * "test": Runs the tests through `mocha`
    * requires `$ npm i -g mocha`
  * "typecheck": Runs the tests over the `src` to check types validity (strongly-typing)
    * requires `$ npm i -g flow-bin`
  * "docs": Runs the tools to output documentation into `docs` folder
    * requires `$ npm i -g documentation`
  * "build": Build the `src` code and output it into root respectively
    * requires `$ npm i -g babel-cli`
