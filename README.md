# WordAIwesome extension

## Development
1) run `yarn install`
2) run `yarn dev`
3) load unpacked extension
    - open `chrome://extensions` in browser
    - turn on developer mode
    - click load unpacked
    - choose dist folder

## Release
1) Run one of
```bash
yarn version --patch
yarn version --minor
yarn version --major
```

2) Run `yarn build`
3) Run `zip -r extension.zip dist/`
