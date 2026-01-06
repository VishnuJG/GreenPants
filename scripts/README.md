# Scripts Directory

This directory contains the modular JavaScript code for the URL Path & Params Editor extension.

## File Structure

```
scripts/
├── constants.js      - Constants, configuration, and global state
├── url-manager.js    - URL loading, parsing, building, and preview
├── path-segments.js  - Path segment operations (add, remove, drag-drop reorder)
├── query-params.js   - Query parameter operations (add, remove, edit)
├── drag-drop.js      - Drag and drop functionality for reordering
├── storage.js        - Storage API, history, and suggestions management
├── actions.js        - User actions (apply URL, copy to clipboard)
├── ui-helpers.js     - UI utilities (tabs, collapsibles)
└── main.js          - Entry point, initialization, event listeners
```

## Module Dependencies

```
main.js
├── url-manager.js
│   ├── constants.js
│   ├── path-segments.js
│   └── query-params.js
├── path-segments.js
│   ├── constants.js
│   └── url-manager.js
├── query-params.js
│   ├── constants.js
│   └── url-manager.js
├── storage.js
│   ├── constants.js
│   ├── url-manager.js
│   ├── path-segments.js
│   └── query-params.js
├── actions.js
│   ├── url-manager.js
│   └── storage.js
└── ui-helpers.js
```

## Module Descriptions

### `constants.js`
- Defines storage keys and configuration constants
- Manages global state (currentUrl, urlObj)
- Provides getters/setters for state management

### `url-manager.js`
- Loads current tab URL
- Displays and updates URL preview
- Builds URL from form inputs
- Populates form fields from URL object
- Loads URLs into editor

### `path-segments.js`
- Renders path segment UI
- Add/remove path segments
- Reorder segments (up/down arrows)
- Add segments with specific values (from suggestions)

### `query-params.js`
- Renders query parameter UI
- Add/remove query parameters
- Add parameters with specific keys (from suggestions)

### `storage.js`
- Chrome storage API wrapper
- Save/load URL history
- Save/load path segment suggestions
- Save/load query parameter suggestions
- Clear history and suggestions

### `actions.js`
- Apply changes and navigate to new URL
- Copy URL to clipboard
- Handle success/error feedback

### `ui-helpers.js`
- Setup collapsible sections
- Other UI utilities

### `main.js`
- Application entry point
- DOM ready initialization
- Event listener setup
- Coordinates all modules

## Usage

The extension uses ES6 modules loaded with `type="module"`:

```html
<script type="module" src="scripts/main.js"></script>
```

All modules use `import`/`export` syntax for clean dependency management.

