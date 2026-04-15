# Study Planner Pro

A vanilla JavaScript productivity and scheduling application designed to manage daily study routines, track task completion, and maintain habit consistency. 

This project utilizes local storage for state persistence and features dynamic UI updates, bilingual support, and gamified progress tracking without relying on heavy external frameworks.

## Core Features

* **Dynamic Scheduling:** Automatically switches between Weekday and Weekend schedules (configured for Friday/Saturday weekends) to provide context-aware daily tasks.
* **State Persistence:** Utilizes browser `localStorage` to save user preferences (theme, language), daily progress, streak counts, and custom tasks across sessions.
* **Bilingual Support:** Full Arabic (RTL) and English (LTR) support. The DOM dynamically updates text content and reading direction based on the selected language state.
* **Progress Tracking & Analytics:**
  * Calculates daily completion percentages and updates SVG progress circles in real-time.
  * Maintains a 14-week contribution heatmap (similar to GitHub's activity graph) to visualize long-term consistency.
  * Tracks daily consecutive logins to maintain a "Streak" counter.
* **Custom Task Management:** Users can add, complete, and delete custom tasks that integrate directly into the daily progress calculations alongside fixed schedule items.
* **Theme Customization:** Includes a toggleable Dark/Light mode that persists via local storage.

## Technical Architecture

The application logic is centralized in `app.js` and built entirely with standard web technologies.

* **State Management:** A global `state` object acts as the single source of truth, tracking language, theme, completed schedule indices, custom tasks, and heatmap data.
* **DOM Manipulation:** Uses optimized, vanilla JavaScript functions to render schedule tables, update progress bars, and handle user inputs dynamically.
* **Time Handling:** Includes a live clock and date renderer localized to the user's language setting, alongside logic to evaluate time differences for streak calculation.
* **Canvas API:** Implements a custom 2D particle system using the HTML5 Canvas API to render a visual celebration when all daily tasks are completed.

## Setup and Installation

This is a front-end application with no build step required.

1. Clone the repository to your local machine.
2. Open the directory containing the project files.
3. Open `index.html` in any modern web browser.

## Code Organization

The JavaScript logic is strictly organized into functional blocks for maintainability:
* `DATA`: Constant configurations for schedules, quotes, and category labels.
* `STATE`: The primary data object driving the application UI.
* `INIT & PERSISTENCE`: Bootstrapping the app and handling `localStorage` reads/writes.
* `RENDER`: Functions responsible for injecting HTML into the DOM.
* `TASK TOGGLING`: Logic for handling schedule completions and custom task arrays.
* `STATS & HEATMAP`: Mathematical calculations for productivity tracking and visual graph generation.
