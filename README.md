# Development of module omx-manager
  1. [Presentation](#presentation)
  2. [Guidelines](#guidelines)
  3. [Tests](#tests)
  4. [Scripts](#scripts)

<a name="presentation"></a>
## Presentation
The development of version >= 0.2.0 of `omx-manager` is done through a strictly process for a good overall module quality. <br />
The quality of the module is done by the following:

  * Javascript coding standard
  * Clean code by linting it
  * Well documented
  * Object-Oriented Programming

All the code is written inside the `lib` folder.

<a name="guidelines"></a>
## Guidelines
  * Javascript standard coding style => rules http://standardjs.com/ and style https://github.com/airbnb/javascript
  * Clean code by linting it => http://eslint.org/
  * Well documented => style http://usejsdoc.org/ and output http://documentation.js.org/
  * Object-Oriented Programming => Plain JS

<a name="tests"></a>
## Tests
The tests are made with [chaijs](http://chaijs.com/) and [mocha](http://mochajs.org/).

<a name="scripts"></a>
## Scripts
The following scripts (available through `package.json`) serves to work with the code `$ npm run <script>`

  * "test": Runs the tests through `mocha`
    * requires `$ npm i -g mocha`
  * "docs": Runs the tools to output documentation into `docs` folder
    * requires `$ npm i -g jsdoc`
