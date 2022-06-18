## About

This repository creates a react webpage that allows to extract a utility function from possibly inconsistent binary comparisons. It presents the users with a series of elements to compare, using merge-sort in the background to cleverly minimize the number of choices needed. Then, it cleverly aggregates them, by taking each element as a reference point in turn, and computing the possible distances from that reference point to all other points, and taking the geometric mean of these distances. This produces a number representing the value of each element, such that the ratios between elements represent the user's preferences: a utility function!

Initially, users could only input numbers, e.g., "A is `3` times better than B". But now, users can also input distributions, using the [squiggle](https://www.squiggle-language.com/) syntax, e.g., "A is `1 to 10` times better than B", or "A is `mm(normal(1, 10), uniform(0,100))` better than B".

## Object structure

The core structure is json array of objects. Only the "name" attribute is required. If there is a "url", it is displayed nicely.

```
[
    {
        "name": "Peter Parker",
        "someOptionalKey": "...",
        "anotherMoreOptionalKey": "...",
    },
    {
        "name": "Spiderman",
        "someOptionalKey": "...",
        "anotherMoreOptionalKey": "..."
    }
]
```

## Netlify

https://github.com/netlify/netlify-plugin-nextjs/#readme

## To do

- [x] Extract merge, findPath and aggregatePath functionality into different repos
- [ ] Add functionality like names, etc.
- [x] Send to mongo upon completion
- [ ] Add paths table
- [ ] warn that the paths table is approximate.
- [x] Push to github
- [x] Push to netlify
- [x] Don't allow further comparisons after completion
- [ ] Look back at Amazon thing which has been running
- [x] Change README.
