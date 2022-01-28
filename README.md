## About
This repository creates a react webpage that allows to extract a utility function from possibly inconsistent binary comparisons

## Object structure
The core structure is json array of objects. Only the "name" attribute is required; the (numerical) id is also internally required but it's created on the fly. The reason that ids are needed is that comparing objects is annoying. 

The `isReferenceValue` property determines the display at the end, but it is optional.

So internally this would look like:

```
[
    {
        "id": 1,
        "name": "Peter Parker",
        "someOptionalKey": "...",
        "anotherMoreOptionalKey": "...",
        "isReferenceValue": true
    },
    {
        "id": 2,
        "name": "Spiderman",
        "someOptionalKey": "...",
        "anotherMoreOptionalKey": "..."
    }
]
```

## Netlify
https://github.com/netlify/netlify-plugin-nextjs/#readme
