# LLD Mastery Hub

A lightweight, responsive learning website for practicing **C++ Low-Level Design (LLD)**, UML, design patterns, and concurrency for software engineering interviews.

## Features

- **12-week roadmap** from OOP and SOLID through design patterns, concurrency, case studies, and mock interviews.
- **Design pattern library** with core problem, approach, C++ sketch, trade-offs, and interview follow-ups.
- **Interactive interview lab** for Parking Lot, Payment Processing, and a Thread-safe Logger.
- **Local study tracker** for daily tasks, streaks, completed weeks, and patterns explored.
- **Light/dark theme**, responsive layout, and searchable pattern cards.
- No build step, package manager, framework, or API key required.

## Run locally

Open index.html in a modern browser.

Alternatively, run this from the project directory if Python 3 is installed:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy with GitHub Pages

1. Open repository **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch main and folder /(root), then save.
4. Wait for deployment. GitHub displays the published URL in the Pages settings.

## How progress is stored

Progress and scratchpad notes are stored in the browser's localStorage. They are not sent to a server and do not sync between devices or browsers. Clearing site data or using the reset button clears this local progress.

## Project structure

```text
lld-mastery-hub/
├── index.html   # Page structure and sections
├── styles.css   # Responsive visual design and theme tokens
├── app.js       # Roadmap, patterns, exercises, and local progress
└── README.md    # Setup and deployment instructions
```

## Learning approach

For each LLD problem:

1. Clarify functional requirements and scope.
2. Identify core entities and assign responsibilities.
3. Draw a class diagram and show relationships/multiplicities.
4. Trace one important use case with a sequence diagram.
5. Implement the core path in C++ with clear ownership and interfaces.
6. Explain trade-offs, extension points, failure handling, and concurrency where relevant.

Design patterns are tools, not goals. Apply one only when it makes the requirements easier to express or the design easier to change.

## Tech stack

- HTML
- CSS
- Vanilla JavaScript
- Browser localStorage

## License

No license has been specified yet. Add a LICENSE file if you want to grant explicit reuse permissions.
