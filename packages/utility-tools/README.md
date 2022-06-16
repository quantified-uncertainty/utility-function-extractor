## Utility function processor

This package contains a series of utilities to work with the utility functions produced by [this utility function extractor](https://utility-function-extractor.quantifieduncertainty.org/openphil-2018-ai-risk)

### Merge sort

Given a list of elements and a list of utilitity comparisons, sort the list.

Gotcha: The list of elements has to be the same list, and in the same order, as that produced when initially doing the comparisons. This is because the merge-sort algorithm depends on the initial order of the list.
