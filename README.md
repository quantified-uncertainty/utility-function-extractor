## About
This repository creates a react webpage that allows to extract a utility function from possibly inconsistent binary comparisons

## Object structure
The core structure is json array of objects. Only the "name" attribute is required; the id is also internally required but it's created on the fly if it doesn't exist. The reason that ids are needed is that comparing objects is annoying. I think that one object must have the `isReferenceValue` property as true, but I'm not sure.

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