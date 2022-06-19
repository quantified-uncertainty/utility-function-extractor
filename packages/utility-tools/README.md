# Utility Tools

This package contains a series of utilities to work with the utility functions produced by [this utility function extractor](https://utility-function-extractor.quantifieduncertainty.org/openphil-2018-ai-risk).

## Built with

- [Squiggle](https://www.squiggle-language.com/)
- [Nodejs](https://nodejs.org/)
- Plain js

## Getting started

### Installation

```sh
yarn add utility-tools
```

then in your file:

```js
import { mergeSort, findPaths, aggregatePaths } from "utility-tools";
```

### Usage

You can find an example how to use and concatenate these functions in `/src/example.js`, as well as an example of the input format needed in the `input` folder.

## Interface

### Merge sort (`mergeSort`)

Given a list of elements and a list of utilitity comparisons, sort the list. If there are not enough comparisons to implement the merge sort algorithm, return one of the missing comparisons.

_Gotcha_: The list of elements has to be the same list, and in the same order, as that produced when initially doing the comparisons. This is because the merge-sort algorithm depends on the initial order of the list.

### Find Paths (`findPaths`)

Given an (ordered) list of elements and a list of utility comparisons, find all possible monotonous paths from each element to each other. A monotonous path is a path that is either all increasing or all decreasing, relative to the ordering given.

_Note_: Some elements will have many more paths than others.

### Aggregate paths (`aggregatePaths`)

Given a list of path, aggregate them to finally produce an estimate of the relative utility of each element.

There are two ways of doing this:

- 1. Aggregate the means (expected values) for each path.
  - This method is fast
  - But has the disadvantage the expected value aggregation is tricky, particularly if one of the elements is positive and the other one negative (because then one can't)
- 2. Aggregate the distributions given for each path.

## Roadmap

I don't have any additions planned for this repository.

## Contact

Feel free to shoot me any questions at `nuno.semperelh@protonmail.com`
