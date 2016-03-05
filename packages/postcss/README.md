# webpack:sass by [The Reactive Stack](https://thereactivestack.com)
Meteor package to integrate PostCSS (.css) import with [Webpack](https://github.com/thereactivestack/meteor-webpack)

## Warning
The .css files in your Meteor project are automatically added to the page stylesheet. Make sure your file is named .import.css unless it is outside your project directory.

## Settings (webpack.json)
- `css.module`: Enable local CSS by default
- `postcss`: Array of postcss plugins to use. Example: `["postcss-import", "autoprefixer"]`

**Note: postcss-import is automatically optimized with Webpack**
