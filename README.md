# webpack:webpack by <a href="https://thereactivestack.com">The Reactive Stack</a>
Seamlessly integrate Webpack to improve Meteor build system<br />
**Compatible with Meteor 1.2 and 1.3**

## Why should you use Webpack?
- No configuration required, you only need to add packages
- Instant feedback when you change your files (not even a page refresh!)
- Organize your assets with the code they belong
- Faster page loading by splitting your code in multiple chunks

## How can I get started?
You can learn how to use Webpack with Meteor by [getting the free course on The Reactive Stack](https://thereactivestack.com).

Many [kickstart projects are also available](https://github.com/thereactivestack/kickstart) so you can clone one that fits your needs.

Or you can start from scratch like this (this is a React / SASS example)

### Start from scratch
```sh
meteor create test-project
cd test-project
meteor remove ecmascript
meteor add webpack:webpack
meteor add webpack:react
meteor add webpack:sass
meteor
npm install
```

## Entry files
Your entry files are defined within your package.json. The main is your server entry and the browser is your client entry.

```json
{
  "name": "test-project",
  "private": true,
  "main": "server/entry.js",
  "browser": "client/entry.js"
}
```

## NPM packages
You can use any NPM package by using the package.json file.

To add a new dependency, run at your project root: `npm install --save module-name`.

## Production
The production mode will be automatically detected and will optimize the bundle. The production is is activated when:

- You run `meteor --production`
- You bundle your project
- You deploy with `mup deploy` or any other tool

## Startup
If you need to run code in Meteor before the startup, you can do that if you name your file `meteor.startup.js`.

Calling `FlowRouter.wait()` is a great example of things you might want to do.

`process.env` will reflect the values while compiling on your computer unless you use it within a `meteor.startup.js` file for now.
