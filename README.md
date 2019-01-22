

# Wallet Photos

A photo-sharing web app for slightly paranoid parents who do not want to share their family photos with Facebook, Google, Palantir, and the rest. The idea is to make it possible for anyone with some technical savvy to deploy their own photo sharing app onto the could.

How paranoid exactly. Users must sign up in order to access the site, but on sign up, the user is treated to a permission pending landing page. Only after an admin (a parent, but others can be made admins as well) approves a user is that user allowed to see photos. A separate permission is given for posting photos as well. A family setting is in the database but not currently implemented. The idea is to safely post super-private pictures of (say) your baby in the bath, or are super-tacky, or whatever.

## Technology Choices

#### JS |> TS

Typescript is a tool I enjoy using to keep my JavaScript code tidy and to help my editor help me by providing better autocomplete.

#### Node |> Express

I seriously considered implementing this in Flask or Django because I prefer to work in Python. But as much as I prefer Python, I know and understand Javascript, Node.js, and Express much better at this stage.

#### SQLite |> TypeORM |> PostgreSQL |> TypeORM

I initially chose SQLite to ease deployment (one less server to configure!) and so that eventually I will be able to use embedded SQLite to make an offline-first mobile experience. SQLite's documentation suggests that it can handle 100k transactions. Since each photo album will be deployed independently, and is private to friends and family, 100k seems more than enough. When I walked through the [checklist](https://www.sqlite.org/whentouse.html), it is clear enough that a full-featured database engine solves problems that I do not expect to encounter. So why not choose something that just works?

TypeORM follows from choosing Typescript. It was designed to play well with a TS workflow, and is reasonably [well documented](https://github.com/typeorm/typeorm). The documentation uses async/await syntax so the code is easier to understand. Also, the models are declared using decorators to describe database columns, which again aids in code clarity.

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

Deployment

I ran into some difficulties deploying the app to the internet. For whatever reason, the Typescript compiler on the server did not accept the //@ts-ignore directive for two lines of authentication code. So I decided to push a compiled JS version to the server instead, which ran into its own set of problems. This turned out to be because a new version of Typescript that was pushed during project week won't work with my code.

Node would not run my app because it couldn't find the binding files for sharp, the library which handles my image processing. The way to fix that was apparently to uninstall and reinstall the package. Even though I had literally just installed by specifying it in my package.json. 

Also, the latest version of bcrypt is not available as a compiled library yet, apparently, so instead of configuring the C compilation environment on my server, I chose to specify a slightly older version of Bcrypt.

Other than those three problems, deployment was fine, if non-trivial. I chose to use Digital Ocean instead of Heroku because I don't mind paying some money to have my own virtual machine in the cloud. The idea of the app is that I pay my own way to host baby pictures so that I am in control. I have some credits from podcasts, so I am not paying yet. I found [this guide](https://codeburst.io/ricky-figures-it-out-devops-deployment-using-express-postgres-and-digital-ocean-15c2d961340e) helpful for setting up my Postgres instance, and the [official guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04) to deploying Node apps to an NGINX reverse proxy was clearly explained and easy to follow.

Eventually, I figured it all out, and now it is running on ts-node on the server, being monitored by PM2, which restarts the instance whenever it stops working. Neat.

It is not as if deploying to Heroku was a trivial affair either. 