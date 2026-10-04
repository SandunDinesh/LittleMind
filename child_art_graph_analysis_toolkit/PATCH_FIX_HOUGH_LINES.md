# Fix for HoughLinesP unpack error

Error:

```text
TypeError: cannot unpack non-iterable numpy.int32 object
```

Fix in `src/art_feature_extractor.py` inside `line_and_stroke_features()`.

Replace:

```python
x1, y1, x2, y2 = line[0]
```

With:

```python
coords = np.asarray(line).reshape(-1)
if coords.size < 4:
    continue

x1, y1, x2, y2 = coords[:4].astype(float)
```
