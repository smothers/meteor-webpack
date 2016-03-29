# webpack:angular by [The Reactive Stack](https://thereactivestack.com)
Meteor package to integrate Angular with [Webpack](https://github.com/thereactivestack/meteor-webpack)

Uses babel ES2015, ng-annotate, and import html. Tested to work with angular from npm, following [NG6](https://github.com/AngularClass/NG6-starter) application layout.

Please use `static-html` package to load you starting index html page

```
// index.html
<head>
  <title>ng6-test</title>
  <base href="/"></base>
</head>

<body>
  <app></app>

</body>

```

Example Component JS File:
```
// home.component.js

import template from './home.import.html' //  Notice you are importing html file
import controller from './home.controller' // ES6 Class Controller
import './home.styl'

let homeComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
}

export default homeComponent

```
```
// home.js (home module)
import angular from 'angular'
import uiRouter from 'angular-ui-router'
import homeComponent from './home.component'

let homeModule = angular.module('home', [
  uiRouter
])

  .config(($stateProvider, $urlRouterProvider) => {
    'ngInject'

    $urlRouterProvider.otherwise('/')

    $stateProvider
      .state('home', {
        url: '/',
        template: '<home></home>'
      })
  })

  .component('home', homeComponent)

export default homeModule
```
