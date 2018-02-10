# Magic Posts

For this Magic afternoon, we're going use a combination of GET and POST requests to retrieve and solve puzzles. Each puzzle can be found on [this URL](https://magicposts.herokuapp.com/) by making GET requests from `/1` to `/30`. Puzzles range in difficulty/points and can be solved by making a POST request to the same URL.

## Registering your team
To register your team, make a POST request in JSON to `/register`:

```js
{
  "team" : "Origin"
}
```

## Retrieve a puzzle

Making a GET request to `/1` returns:
```js
{
  "message" : "How would you select an element by an ID?"
}
```

## Solving a puzzle
To solve, make a POST request to `/1` in the following format:
```js
{
  "team" : "Origin",
  "answer" : '' 
}
```


Some resources:
 - [Postman](https://www.getpostman.com/)

### Level 1
Register your team!
### Level 2:
Solve a puzzle!
### Level 3:
Solve 10 puzzles!

### Level 4:
Solve 20 puzzles!
### Level 5:
Solve all 30 puzzles!
## Conclusion
The specification is otherwise open-ended to the implementation of the page set-up.
