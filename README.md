# Sorting Algorithms Animation Library

By [Nanaryu](https://github.com/Nanaryu) & [Evgen4X](https://github.com/Evgen4x)

## Available algorithms
| Name | Key (case-insensitive) |
| - | - |
| [Bogo sort](https://en.wikipedia.org/wiki/Bogosort) | `bogo` |
| [Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort) | `bubble` |
| [Insertion sort](https://en.wikipedia.org/wiki/Insertion_sort) | `insertion` |
| [Merge sort](https://en.wikipedia.org/wiki/Merge_sort) | `merge` |
| [Quick sort](https://en.wikipedia.org/wiki/Quicksort) | `quick` |
| [Radix sort](https://en.wikipedia.org/wiki/Radix_sort) | `radix` |
| [Selection sort](https://en.wikipedia.org/wiki/Selection_sort) | `selection` |
| [Stalin sort](https://github.com/gustavo-depaula/stalin-sort) | `stalin` |

## Usage

> [!IMPORTANT]
> Download [sortanim.js](https://github.com/Nanaryu/Nanaryu.github.io/blob/main/sortanim.js) & [style.css](https://github.com/Nanaryu/Nanaryu.github.io/blob/main/style.css) and include them in your HTML file directory as shown below.

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
> Use only one `initSortAnim()` per file. Multiple canvas support will be added in the future.

## Customization

You can change values of the following variables **after** importing the file to customize colors.

| variable | definition |
| - | - |
| `canvas_background_color` | BG color of the canvas |
| `bar_color` | Default color of bars |
| `bar_border_color` | Default border color of bars |
| `bar_sorted_color` | Color of bars when they are sorted |
| `bar_sorted_border_color` | Border color of sorted bars |
| `bar_changed_color` | Color of bars which were changed |
| `bar_changed_background_color` | Border color of changed bars |

> [!NOTE]
> Borders are only visible with LDM on.

## Example

```html
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="style.css"> <!-- feel free to customize -->
    </head>
    <body>
        <div id="bubble-sort-animation">
            
        <script src="sortanim.js"></script>
        <script>
            initSortAnim("bubble-sort-animation", ["bubble"]);
        </script>
    </body>
</html>
```