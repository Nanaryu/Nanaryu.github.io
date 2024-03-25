# Sorting Algorithms Animation Library

By [Nanaryu](https://github.com/Nanaryu) & [Evgen4X](https://github.com/Evgen4x)

## Available algorithms
| Name | Key (case-insensitive) |
| ---- | --- |
| [Bogo sort](https://en.wikipedia.org/wiki/Bogosort) | `bogo` |
| [Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort) | `bubble`|
| [Insertion sort](https://en.wikipedia.org/wiki/Insertion_sort) | `insertion` |
| [Merge sort](https://en.wikipedia.org/wiki/Merge_sort) | `merge` |
| [Quick sort](https://en.wikipedia.org/wiki/Quicksort) | `quick` |
| [Radix sort](https://en.wikipedia.org/wiki/Radix_sort) | `radix` |
| [Selection sort](https://en.wikipedia.org/wiki/Selection_sort) | `selection` |
| [Stalin sort](https://github.com/gustavo-depaula/stalin-sort) | `stalin` |

## Usage

> [!IMPORTANT]
> Download [sortanim.js](https://github.com/Nanaryu/Nanaryu.github.io/blob/main/sortanim.js) and include it in your HTML file directory as shown below

```html
<script src="sortanim.js"></script> <!-- library import -->

<script>
    let parent_element_id = "main";
    let key_list = ["key1", "key2", ...];
    /*
    if key list is empty, the animation menu will have
    all available sorting algorithms
    */
    initSortAnim(parent_element_id, key_list);
</script>
```

> [!CAUTION]
> Use only one `initSortAnim()` per file. Multiple canvas support will be added in the future

## Example
```html
<body>
    <div id="bubble-sort-animation">
        
    <script src="sortanim.js"></script>
    <script>
        initSortAnim("bubble-sort-animation", ["bubble"]);
    </script>
</body>
```