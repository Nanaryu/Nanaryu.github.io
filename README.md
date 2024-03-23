## Sorting Algorithms Animation Library

By [Nanaryu](https://github.com/Nanaryu) & [Evgen4X](https://github.com/Evgen4x)

### Available algorithms
| Name | Key (case-insensitive) |
| ---- | --- |
| [Bogo sort](https://en.wikipedia.org/wiki/Bogosort) | `bogo` |
| [Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort) | `bubble`|
| [Insertion sort](https://en.wikipedia.org/wiki/Insertion_sort) | `insertion` |
| [Merge sort](https://en.wikipedia.org/wiki/Merge_sort) | `merge` |
| [Quick sort](https://en.wikipedia.org/wiki/Quicksort) | `quicksort` |
| [Radix sort](https://en.wikipedia.org/wiki/Radix_sort) | `radix` |
| [Selection sort](https://en.wikipedia.org/wiki/Selection_sort) | `selection` |
| [Stalin sort](https://github.com/gustavo-depaula/stalin-sort) | `stalin` |

### Usage

> Download [script.js](https://github.com/Nanaryu/Nanaryu.github.io/blob/main/script.js) and include it in your HTML file directory as shown below

```html
<script src="script.js"></script> <!-- library import -->

<script>
    let parent_element_id = "main";
    let key_list = ["key1", "key2", ...];
    /*
    if key list is empty, the animation menu will have
    all available sorting algorithms
    */
    init(parent_element_id, key_list);
</script>
```

> [!CAUTION]
> Use only one `init()` per file.

### Example
```html
<body>
    <div id="bubble-sort-animation">
        
    <script src="script.js"></script>
    <script>
        init("bubble-sort-animation", ["bubble"]);
    </script>
</body>
```