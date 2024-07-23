# main

Call a function when script is invoked directly (e.g. cli or
subprocess).

```javascript
require("main")(module, () => {
    /*
        [ code to run here ]
  */
});
```

The callback will NOT run if imported into another module.

<sub>Note: The [variable `module`][vm] is required.</sub>

[vm]: https://nodejs.org/api/modules.html#modules_the_module_object

## Install

```
npm i main --save
```

## This package used for bundle invexcomponent. 
```
yarn build:invexchart
```
Generates build file
