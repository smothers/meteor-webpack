# webpack:stylus by [The Reactive Stack](https://thereactivestack.com)
Meteor package to integrate Stylus (.styl) import with [Webpack](https://github.com/thereactivestack/meteor-webpack)

## Settings (webpack.json)
- `stylus`: Array of stylus plugins names to use mapped to the npm package path

```json
{
  "stylus": [
    {"nib": "~nib/lib/nib/index.styl" },
    {"jeet": "~jeet/stylus/jeet/index.styl" },
    {"axis": "~axis/axis/index.styl" },
    {"rupture": "~rupture/rupture/index.styl" },
    {"typographic": "~typographic/stylus/typographic.styl" }
  ]
}
```

Note: Make sure to include the stylus plugins you use in your package.json file.

## Credits
Thanks to @zaklampert for writing this package!
Thanks to @jptissot for introducing configurable plugin support
