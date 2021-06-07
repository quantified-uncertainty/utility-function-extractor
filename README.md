## Object structure
The core structure is json array of objects. Only the "name" attribute is necessary; the id is also internally necessary but it's created on the fly if it doesn't exist. The reason that ids are needed is that comparing objects is annoying.
```
[
    {
        "id": 1,
        "name": "Peter Parker",
        "someOptionalKey": "...",
        "anotherMoreOptionalKey": "..."
    },
    {
        "id": 2,
        "name": "Spiderman",
        "someOptionalKey": "...",
        "anotherMoreOptionalKey": "..."
    }
]
```