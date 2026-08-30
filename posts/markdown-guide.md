这篇文章演示本站支持的 Markdown 语法,以及代码块的语法高亮效果。你可以把它当作写作参考。

## 基础语法

- **加粗**、*斜体*、~~删除线~~、`行内代码`
- 支持 [链接](https://example.com) 和图片
- 有序 / 无序列表、引用、分割线

> 引用块:学而不思则罔,思而不学则殆。

---

## 代码高亮

本站使用 highlight.js 做代码高亮。下面是一些例子:

### JavaScript

```js
function greet(name) {
  const msg = `你好,${name}!`;
  console.log(msg);
  return msg;
}

greet("世界");
```

### Python

```python
def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print(fib(10))
```

### 命令行

```bash
# 本地预览
python -m http.server 8080
```

## 表格

| 功能 | 是否支持 | 说明 |
| --- | --- | --- |
| 标题 | ✅ | h1 ~ h6 |
| 列表 | ✅ | 有序 / 无序 |
| 代码高亮 | ✅ | highlight.js |
| 表格 | ✅ | GFM 语法 |

## 小结

写作时,你只需要专注内容本身,格式交给 Markdown 就好。开始写你的第一篇吧!✍️
