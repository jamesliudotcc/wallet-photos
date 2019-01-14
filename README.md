

# Wallet Photos

A photo-sharing web app for slightly paranoid parents who do not want to share their family photos with Facebook, Google, Palantir, and the rest. The idea is to make it possible for anyone with some technical savvy to deploy their own photo sharing app onto the could.



Technology Choices

#### JS |> TS

Typescript is a tool I enjoy using to keep my JavaScript code tidy and to help my editor help me by providing better autocomplete.

#### Node |> Express

Only so many new technologies at one time. Only so many new technologies at one time.

#### SQLite |> TypeORM

I chose SQLite to ease deployment (one less server to configure!) and so that eventually I will be able to use embedded SQLite to make an offline-first mobile experience. SQLite's documentation suggests that it can handle 100k transactions. Since each photo album will be deployed independently, and is private to friends and family, 100k seems more than enough. When I walked through the [checklist](https://www.sqlite.org/whentouse.html), it is clear enough that a full-featured database engine solves problems that I do not expect to encounter. So why not choose something that just works?

TypeORM follows from choosing Typescript. It was designed to play well with a TS workflow, and is reasonably [well documented](https://github.com/typeorm/typeorm).

#### Pug |> Tachyons

Pug's syntax, suggestive of Python's, is easier to read and reason about. One advantage of using whitespace to auto-close HTML tags is that it allows me to see more of my html content at one time. Sometimes, I even use Pug to generate static html.

Tachyons gives me a declarative syntax and a set of components that is easy to design with. It does much less than full-featured frameworks like Bootstrap or Materialize, but that allows me greater flexibility. And it is easy to generate layouts that are sympatico with the minimalist aesthetic I favor.

<div>Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>



### Sprint 1

First weekend + M+T: All core functionality complete





### Sprint 2

W + Th: MVP: All functionality + basic styling





### Sprint 3

F + Second weekend: Finish, README, stretch goals