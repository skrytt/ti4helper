# TI4 Helper

A Twilight Imperium 4 helper app that no-one in my regular group asked for but everyone got :) My group play in-person, and the room we play in has a large television screen with a 16:9 ratio. I liked the idea of using the screen for a heads-up display of basic game information, so I made one.

This has the following design goals:

- Provide information that's useful during play and sometimes difficult to track, primarily during the Action Phase, such as the current and upcoming turns and pass statuses. 
- Be unobtrusive: avoid distracting too much from the table. Don't serve information that the table serves clearly, such as in-play objectives, victory point tracking and so on.
- Look clean and bold; make the active player feel big and important!

A secondary reason for building this was as an excuse to practice Vue 3, TypeScript and frontend web design. All bugs and bad design decisions come included; there are no automated tests or lints. I don't have plans to address this.

## Limitations

A couple of notable limitations that aren't design choices so much as "maybe I could fix this later":

- Does not currently account for Naalu Collective's ability or promissory note that affect action phase influence order
- Does not currently support games where each player selects 2 or more strategy cards
- Currently, all state is lost on a page refresh. Don't refresh the page! It would be nice to store state in cookies to avoid data loss in this scenario.

## Installation and Usage

You will need `pnpm` to host a development webserver:

```sh
pnpm install
pnpm dev
```

Then, access the app at [localhost:5173](http://localhost:5173).