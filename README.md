# 🚀 API Tester & URL Editor - Chrome Extension

**Version 2.0** - A powerful Chrome extension that combines intelligent URL editing with full-featured API testing capabilities. Test APIs with custom headers, request bodies, and all HTTP methods - all in a beautiful, modern interface!

## ✨ Features

### 🔗 Smart URL Builder (NEW!)
- **Unified Interface**: Edit paths and query parameters in one convenient tab
- **Drag & Drop**: Reorder path segments with intuitive drag handles
- **Live Preview**: Real-time URL updates as you type
- **Collapsible URL Display**: URL visible in every tab when you need it
- **Protocol & Host Editing**: Full control over all URL components
- **Hash/Fragment Support**: Edit URL anchors
- **Recent Suggestions**: Quick access to previously used segments and parameters

### 🚀 Full-Featured API Testing
- **All HTTP Methods**: GET, POST, PUT, DELETE, PATCH with color-coded badges
- **Custom Headers**: Unlimited custom headers (Authorization, Content-Type, API keys, etc.)
- **Request Bodies**: 
  - JSON (with validation)
  - Form Data (URL-encoded)
  - Raw Text
  - None (for GET/DELETE)
- **Method Selector**: Visual buttons with automatic body tab hints

### 📊 Professional Response Viewer (NEW!)
- **Full Chrome Tab**: Opens in dedicated tab with full screen space (not a popup!)
- **Tabbed Interface**: Switch between Response Body, Headers, and Raw view
- **Status Indicators**: Color-coded success (green) and error (red) badges
- **Request Info**: Method, URL, and duration displayed clearly
- **Formatted Output**: Pretty-printed JSON with syntax highlighting
- **One-Click Copy**: Copy headers or body to clipboard instantly
- **Smart URL Wrapping**: Long URLs display properly without overflow

### 🎯 Smart Tab Management (NEW!)
- **Dropdown Selector**: Clean, space-saving tab navigation
- **Usage Tracking**: Tabs automatically reorder based on your usage
- **Last Tab Memory**: Opens to the last tab you were using
- **Sorted by Frequency**: Most-used tabs appear first

### ⌨️ Keyboard Shortcuts (NEW!)
- **Enter Key**: Press Enter anywhere to navigate (smart detection)
- **Tab Navigation**: Quick switching between sections
- **Escape**: Close collapsible sections

### 📅 Timestamp Viewer
- Auto-convert Unix timestamps on any webpage
- Multiple format options (ISO 8601, RFC 2822, Custom)
- Toggle on/off without page reload
- Works on dynamically loaded content

### 📜 History & Smart Suggestions
- **URL History**: Track all copied and navigated URLs
- **Quick Insert Chips**: Reuse path segments and parameters
- **Usage Badges**: See which URLs were copied vs navigated
- **Clear Options**: Remove history and suggestions anytime
- **Collapsible Sections**: Keep interface clean

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top-right corner)
3. Click "Load unpacked"
4. Select the `urlPathEditor` directory
5. The extension icon should appear in your toolbar

## 🎯 Usage

### Quick Start - URL Editing

1. **Navigate to any webpage**
2. **Click the extension icon** in your toolbar
3. **Select "🔗 URL Builder"** from the dropdown (default tab)
4. **Edit components**:
   - Drag path segments to reorder
   - Add/remove path segments
   - Add/remove query parameters
5. **Press Enter** or click **"🌐 Navigate"** (green button)

### Quick Start - API Testing

1. **Click the extension icon**
2. **Enter your API URL** (or edit current page URL)
3. **Select HTTP method** (GET, POST, PUT, DELETE, PATCH)
4. **Switch to "📋 Headers & Body" tab**:
   - Add Authorization header: `Authorization: Bearer your_token`
   - Select body type (JSON/Form/Raw/None)
   - Enter request data
5. **Click "🚀 Send Request"**
6. **Response opens in new tab** with full details!

### Response Viewer Features

The response viewer tab displays:
- ✅ **Status Badge**: Color-coded (green=success, red=error) with code
- ⏱️ **Duration**: Request timing in milliseconds
- 🌐 **Full URL**: Complete request URL (properly wrapped)
- 📊 **Three Tabs**:
  - **Response Body**: Formatted JSON or raw text
  - **Headers**: All response headers
  - **Raw**: Complete raw response
- 📋 **Copy Buttons**: One-click copy for each section

### Using History & Suggestions

**History Section (Collapsible):**
- View all previously copied or navigated URLs
- Each entry shows a badge ("copied" or "navigated")
- Click any URL to instantly load it into the editor
- Clear all history with the "Clear History" button

**Quick Insert Section (Collapsible):**
- **Recently Used Path Segments**: Click any chip to add that segment to your path
- **Recently Used Parameters**: Click any chip to add that parameter key (you fill in the value)
- These suggestions are automatically saved when you copy or navigate
- Clear all suggestions with the "Clear Suggestions" button

## ⌨️ Keyboard Shortcuts

- **Enter**: Navigate to URL (works from anywhere in popup, except when editing text)
- **Tab**: Navigate between form fields
- **Escape**: Close the extension popup

## 📚 Examples

### Example 1: Testing a GET API

```
1. Open extension
2. URL: https://jsonplaceholder.typicode.com/posts/1
3. Method: GET (default)
4. Click "Send Request"
5. View response in new tab!
```

### Example 2: POST with JSON

```
1. URL: https://api.example.com/users
2. Method: POST
3. Headers tab:
   - Authorization: Bearer abc123xyz
4. Body tab:
   - Type: JSON
   - Data: {"name": "John", "email": "john@example.com"}
5. Click "Send Request"
6. See 201 Created response!
```

### Example 3: Editing Path Segments

```
Original: https://example.com/products/shoes/nike
Actions:
  - Drag "shoes" below "nike" to reorder
  - Add segment "mens"
  - Remove "nike"
Result: https://example.com/products/mens/shoes
```

### Example 4: Adding Query Parameters

```
Original: https://api.example.com/search
Actions:
  - Add param: q = "laptops"
  - Add param: page = "1"
  - Add param: limit = "20"
Result: https://api.example.com/search?q=laptops&page=1&limit=20
```

### Example 5: Using Smart Tab Ordering

```
1. Open extension multiple times
2. Use "Headers & Body" tab frequently
3. Notice it moves to top of dropdown
4. Next time you open, your most-used tabs are first!
```

## 🔧 Technical Details

- **Version**: 2.0
- **Manifest Version**: 3 (Modern Chrome Extensions)
- **Architecture**: Modular ES6 JavaScript (no dependencies)
- **Permissions**: 
  - `activeTab`: Read current tab URL
  - `tabs`: Create response viewer tabs
  - `scripting`: Content script injection
  - `storage`: Local data persistence
  - `host_permissions`: HTTP requests to any domain
- **Browser Support**: Chrome/Edge (Manifest V3 compatible)
- **Data Storage**: 100% local (Chrome Storage API)
- **Privacy**: No external servers, no tracking, no analytics
- **Content Scripts**: Timestamp viewer on web pages
- **Response Storage**: Temporary chrome.storage for tab communication

## Files Structure

```
urlPathEditor/
├── manifest.json             # Extension configuration (v2.0)
├── hello.html               # Main popup UI
├── response-viewer.html     # Response viewer page (NEW!)
├── hello_extensions.png     # Extension icon
├── scripts/                 # Modular JavaScript code
│   ├── main.js             # Entry point & initialization
│   ├── constants.js        # Constants & global state
│   ├── url-manager.js      # URL operations & building
│   ├── path-segments.js    # Path segment operations (drag-drop)
│   ├── query-params.js     # Query parameter operations
│   ├── headers-manager.js  # HTTP headers management (NEW!)
│   ├── body-manager.js     # Request body handling (NEW!)
│   ├── http-request.js     # HTTP request execution (NEW!)
│   ├── response-viewer.js  # Response viewer logic (NEW!)
│   ├── response-panel.js   # Legacy content script
│   ├── storage.js          # Chrome storage & history
│   ├── actions.js          # User actions (navigate, copy)
│   ├── ui-helpers.js       # UI utilities (tabs, collapsibles)
│   ├── drag-drop.js        # Drag & drop functionality
│   ├── timestamp-viewer.js # Timestamp conversion
│   ├── timestamp-settings.js # Timestamp feature settings
│   └── README.md           # Scripts documentation
├── PRIVACY_POLICY.md       # Privacy policy
└── README.md               # This file
```

## 🛠️ Development

The extension is built with **vanilla JavaScript** (zero dependencies) using modern ES6 modules:

### Core Modules

- **`main.js`** - Application initialization, event listeners, global Enter key handler
- **`constants.js`** - Global state management and configuration
- **`url-manager.js`** - URL parsing, building, and real-time preview
- **`ui-helpers.js`** - Tab management with usage tracking and sorting

### URL Editing

- **`path-segments.js`** - Path manipulation with drag & drop reordering
- **`query-params.js`** - Query parameter CRUD operations
- **`drag-drop.js`** - Drag and drop functionality for segments

### API Testing

- **`headers-manager.js`** - Dynamic header rows (add/remove/edit)
- **`body-manager.js`** - Body type selection and validation (JSON/Form/Raw)
- **`http-request.js`** - Fetch API integration, method handling, error management
- **`response-viewer.js`** - Response tab logic with chrome.storage communication

### Features

- **`storage.js`** - Chrome Storage API wrapper for history and suggestions
- **`actions.js`** - User actions (navigate, copy URL, send request)
- **`timestamp-viewer.js`** - Content script for timestamp conversion
- **`timestamp-settings.js`** - Timestamp feature configuration

### Architecture Highlights

- ✅ **Modular Design**: Each feature in its own module
- ✅ **No Dependencies**: Pure JavaScript, no frameworks
- ✅ **ES6 Modules**: Clean imports/exports
- ✅ **Error Handling**: Comprehensive null checks and try-catch blocks
- ✅ **Storage First**: chrome.storage for reliable tab communication
- ✅ **Smart Defaults**: Collapsible sections, tab memory, usage tracking

## Data Privacy

- ✅ All data is stored **locally** on your machine using Chrome's storage API
- ✅ No data is ever sent to any external servers
- ✅ No tracking or analytics
- ✅ History and suggestions can be cleared at any time

📄 **[Read Full Privacy Policy](PRIVACY_POLICY.md)**

## 🎯 What's New in v2.0

### Major Features
- ✅ Full API testing with all HTTP methods
- ✅ Custom headers and request bodies
- ✅ Response viewer in dedicated Chrome tab
- ✅ Smart tab sorting by usage frequency
- ✅ Combined URL Builder (paths + params in one tab)
- ✅ Global Enter key to navigate
- ✅ Collapsible URL display in every tab
- ✅ Green Navigate button with enter symbol

### Improvements
- ✅ Zero external dependencies
- ✅ Comprehensive null safety checks
- ✅ Chrome storage for reliable communication
- ✅ Better error handling
- ✅ Improved UX with smart defaults
- ✅ Proper URL wrapping in response viewer

### Bug Fixes
- ✅ Fixed timing issues with response display
- ✅ Resolved null pointer errors
- ✅ Fixed CSP violations with external scripts
- ✅ Improved initialization order

## 🚀 Future Enhancements

Potential features for v3.0:
- Request collections/favorites
- Environment variables
- GraphQL query builder
- WebSocket testing
- Request/response history viewer
- Export requests as curl/code snippets
- Import from Postman collections
- Bulk URL operations
- Advanced authentication flows (OAuth)

## 📝 License

Free to use and modify for personal and commercial projects.

## 💬 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Questions**: Check the documentation first
- **Contributing**: Pull requests welcome!

## 🌟 Changelog

### Version 2.0 (Current)
- Full API testing capabilities
- Response viewer in dedicated tab
- Smart tab management with usage tracking
- Combined URL Builder
- Global keyboard shortcuts
- Improved error handling

### Version 1.2
- Timestamp viewer
- URL history
- Path segment suggestions

### Version 1.0
- Initial release
- Basic URL editing
- Path and query parameter management

---

**Made with ❤️ for developers who love efficient tools**

⭐ Star this repo if you find it useful!

