
# language definition files

## tokenizer
Token templates:
```typescript
{
  //allows any from unordered set of chars
  allow: "abcd",

  //no match when encountered, next template will be tried
  disallow: "efgh",

  //set min number of chars to satisfy template
  min-chars: 1,

  //set the max number of chars to satisfy template
  max-chars: 1
}
```

Advanced properties

```typescript
//Quote matching example

{
  //allow and single or double quote
  allow: "'\"",

  //require one
  min-chars: 1,
  max-chars: 1,

  /* saves the read char(s) to a name
   * for the duration of the statement
   * template parse
   */
  save: "quote-type"
},
{
  //allow any char
  allow: -1,
  //except the saved quote type
  disallow: {
    from: "save",
    save: "quote-type",
    unless: {
      previous: "\\"
    }
  }

  //allow any size string content
  min-chars:0,
  max-chars:-1
},
{
  //allow only the saved type
  allow-save: "quote-type",

  //require one
  min-chars: 1,
  max-chars: 1
},
```
