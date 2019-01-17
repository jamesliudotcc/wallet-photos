

# Wallet Photos

A photo-sharing web app for slightly paranoid parents who do not want to share their family photos with Facebook, Google, Palantir, and the rest. The idea is to make it possible for anyone with some technical savvy to deploy their own photo sharing app onto the could.



Technology Choices

#### JS |> TS

Typescript is a tool I enjoy using to keep my JavaScript code tidy and to help my editor help me by providing better autocomplete.

#### Node |> Express

Only so many new technologies at one time. Only so many new technologies at one time.

#### SQLite |> TypeORM |> PostgreSQL |> TypeORM

I chose SQLite to ease deployment (one less server to configure!) and so that eventually I will be able to use embedded SQLite to make an offline-first mobile experience. SQLite's documentation suggests that it can handle 100k transactions. Since each photo album will be deployed independently, and is private to friends and family, 100k seems more than enough. When I walked through the [checklist](https://www.sqlite.org/whentouse.html), it is clear enough that a full-featured database engine solves problems that I do not expect to encounter. So why not choose something that just works?

TypeORM follows from choosing Typescript. It was designed to play well with a TS workflow, and is reasonably [well documented](https://github.com/typeorm/typeorm).

However, as nice as it is to work with, in some ways it is not production ready. For example, it has problems interacting with foreign key constraints in SQLite. https://github.com/typeorm/typeorm/issues/2576

Once I did have it working, by changing databases to Postgres, magical things started happening. The one-to-many relationship syntax stopped throwing type errors, and it started just working. The syntax looks like this inside of the photo model:

```typescript
  @OneToMany(type => Comment, comment => comment.photo, { eager: true })
  comments: Comment[];
```

And it turned out, attaching the array of comments from my controller to my view took this line, which started autocompleting after I started photo:

```typescript
comments: photo.comments,
```

Autocomplete! just in case the syntax wasn't completely intuitive as it is. Then in the views, just this:

```pug
      ul
        each comment in photo.comments
          li= comment.comment
```

That's it. A good ORM is magic.

#### Pug |> Tachyons

Pug's syntax, suggestive of Python's, is easier to read and reason about. One advantage of using whitespace to auto-close HTML tags is that it allows me to see more of my html content at one time. Sometimes, I even use Pug to generate static html.

Tachyons gives me a declarative syntax and a set of components that is easy to design with. It does much less than full-featured frameworks like Bootstrap or Materialize, but that allows me greater flexibility. And it is easy to generate layouts that are sympatico with the minimalist aesthetic I favor.

<div>Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>

Sharp

Sharp is a performant image library with clear [documentation](http://sharp.pixelplumbing.com/en/v0.17.0/). I use it to parse incoming jpegs into smaller file sizes.

### Sprint 1

First weekend + M+T: All core functionality complete





### Sprint 2

W + Th: MVP: All functionality + basic styling





### Sprint 3

F + Second weekend: Finish, README, stretch goals