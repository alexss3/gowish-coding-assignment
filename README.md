# GoWish Coding Assignment

Start time: 20:20
End time: 23:18

<img width="1156" height="841" alt="gowish-wishlist-1" src="https://github.com/user-attachments/assets/2b242dba-d798-456c-9b70-a785ae334d6a" />
<img width="1154" height="1068" alt="gowish-wishlist-2" src="https://github.com/user-attachments/assets/0ce99d6a-265a-4bfb-88df-885ff97988d9" />
<img width="1156" height="963" alt="gowish-wishlist-3" src="https://github.com/user-attachments/assets/1f7f5948-95a5-419f-b4b3-684d3ce8675d" />

## How to run it

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes `npm`), **or**
- [Bun](https://bun.sh/) 1.0 or newer

You only need one of the two. Pick whichever you have installed.

### 1. Install dependencies

Using npm:

```bash
npm install
```

Using Bun:

```bash
bun install
```

> **Reproducible installs:** the repo commits both lockfiles (`package-lock.json`
> for npm and `bun.lock` for Bun), so dependency versions are pinned. For a
> strict, lockfile-exact install (recommended for CI), use `npm ci` instead of
> `npm install`. It installs directly from `package-lock.json` and fails if it
> drifts from `package.json`, rather than silently updating it.

### 2. Start the dev server

Using npm:

```bash
npm run dev
```

Using Bun:

```bash
bun run dev
```

Vite will print a local URL (by default http://localhost:5173). Open it in your
browser to view the app. The dev server supports hot module reloading, so saved
changes appear instantly.

### 3. Build for production (optional)

Type-checks the project and outputs an optimized build to the `dist/` folder.

Using npm:

```bash
npm run build
```

Using Bun:

```bash
bun run build
```

### 4. Preview the production build (optional)

Serves the contents of `dist/` locally so you can verify the production build.
Run a build first.

Using npm:

```bash
npm run preview
```

Using Bun:

```bash
bun run preview
```

### Formatting (optional)

Check formatting with Prettier:

```bash
npm run format:check   # or: bun run format:check
```

Fix formatting issues in place:

```bash
npm run format:write   # or: bun run format:write
```

## Decisions

There were a few areas that I felt the brief was ambiguous so I had to make my own decisions.

- It doesn't describe how exactly to handle the API failing (specific error messages, a toaster, ErrorBoundary, etc.), but I felt it should at least fail gracefully.  I added a nice marketing-friendly error scenario that is empathetic to the user.

- The ability to reserve an item on your own wishlist seems a of an odd user story.  I assume since this is an exercise that it was more important to tackle how the reservation system works rather than dealing with two different user journeys: editor versus viewer. I added the ability to reserve one's own items with error handling if the API says they were already reserved by someone else.

- There was no mention of the ability to unreserve an already reserved item if you were the one that reserved it, however it does appear in the API. Since there is already so much overlap between the two, it wasn't much effort to add the mirrored functionality.

- Handling the case of reservation failure was quite vague.  I leaned on my experience here and chose to display a message to the user about who has already reserved the item and also removed their ability to try it again as future attempts would be futile. Network errors however still allow the user to try again.


## Ain't nobody got time for that!

- I would look for ways to compose the components a bit smarter, especially if the app grew and it was clear that larger ones can be broken down into smaller, reusable components.  

- A component library would be nice, but due to lack of time I opted to scrape the GoWish website and borrow the styling from there.

- It would be nice to see separate wishlists or create new wishlists.

- Persisting the storage would be nice so that browser refreshes or HMR (hot module reload) doesn't erase any dummy data you have generated while developing.  Perhaps a simple SQLite or sessionState would do nicely.


## Complaint Department

- Loading state - should be much better, perhaps a skeleton.

- Some product images would be nice! What's lacking is the ability to edit an item on your wishlist where you could update the image URL.
