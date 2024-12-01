# Wanted! Minigame
A web recreation of the "Wanted!" minigame from Super Mario 64 DS

The game currently has no graphics, just plain squares to avoid copyright/legal issues with Nintendo.

## Development
The game works with HTML elements, e.g. each head is an `<img>`, rather than drawing everything to a canvas.

Levels are implemented as classes that implement the *Level* interface, they provide a desired headcount, initialise function & update function.

Everything is frame-rate independent by tracking elapsedTime/deltaTime and using it in movement calculations.

The game is built with dev dependencies vite & typescript but builds with no dependencies (and I want to keep it that way).

Main branch is deployed automatically via cloudflare pages at https://wantedminigame.pages.dev.

To run locally:
* `npm i`
* `npm run dev`