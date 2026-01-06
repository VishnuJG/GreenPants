# 🚀 Release Notes - Version 2.0

## Major Release: API Testing + URL Editing

We're excited to announce Version 2.0 - a complete transformation from a simple URL editor to a full-featured API testing tool!

---

## 🎉 What's New

### 🚀 Complete API Testing Suite
Test REST APIs directly from your browser without leaving Chrome:

- **All HTTP Methods**: GET, POST, PUT, DELETE, PATCH with visual method selector
- **Custom Headers**: Add unlimited headers (Authorization, API keys, etc.)
- **Request Bodies**: Support for JSON (validated), Form Data, and Raw Text
- **Body Types**: Smart editor with type selection and validation

### 📊 Professional Response Viewer
Responses now open in a dedicated Chrome tab:

- **Full Screen**: No more tiny popups - use the full browser space
- **Tabbed Interface**: Switch between Response Body, Headers, and Raw views
- **Status Indicators**: Color-coded badges (green for success, red for errors)
- **Request Info**: Method, URL, and duration displayed prominently
- **One-Click Copy**: Copy headers or body to clipboard instantly
- **Smart Wrapping**: Long URLs display properly without overflow

### 🔗 Smart URL Builder
Combined interface for better workflow:

- **Unified Tab**: Edit paths and query parameters together
- **Drag & Drop**: Reorder path segments visually
- **Live Preview**: See URL changes in real-time
- **Collapsible Sections**: URL display available in every tab

### 🎯 Intelligent Tab Management
Extension learns from your usage:

- **Dropdown Selector**: Clean, space-saving navigation
- **Usage Tracking**: Tabs automatically reorder by frequency
- **Last Tab Memory**: Opens to your last used tab
- **Smart Sorting**: Most-used features always at the top

### ⌨️ Keyboard Shortcuts
Work faster with keyboard:

- **Enter Key**: Navigate from anywhere (smart detection)
- **Quick Navigation**: No more mouse hunting for the button
- **Safe Handling**: Doesn't interfere with typing in fields

### 🎨 UI Enhancements
Polish and professionalism:

- **Green Navigate Button**: With enter symbol (⏎) for clarity
- **Color-Coded Methods**: Each HTTP method has its own color
- **Proper Text Wrapping**: Long URLs wrap nicely in response viewer
- **Improved Spacing**: Better visual hierarchy throughout

---

## 🔧 Technical Improvements

### Architecture
- **Chrome Storage API**: Reliable communication between pages
- **Modular Design**: Each feature in its own clean module
- **Zero Dependencies**: Pure JavaScript, no frameworks
- **ES6 Modules**: Modern, maintainable code structure

### Reliability
- **Comprehensive Null Checks**: No more "Cannot read property" errors
- **Better Error Handling**: Graceful failures with helpful messages
- **Initialization Order**: Fixed timing issues
- **Storage-First Communication**: More reliable than message passing

### Performance
- **Lazy Loading**: Features load only when needed
- **Efficient Updates**: Minimal DOM manipulation
- **Smart Defaults**: Quick startup with remembered preferences

---

## 📋 Migration from v1.x

If you're upgrading from v1.x:

1. **No Action Needed**: Extension will update automatically
2. **History Preserved**: Your URL history and suggestions remain intact
3. **New Permissions**: You'll be prompted to accept new permissions for API testing
4. **Tab Layout Changed**: "Path Segments" and "Query Params" are now combined

---

## 🎓 Getting Started

### For URL Editing:
1. Click extension icon
2. Select "🔗 URL Builder" tab
3. Edit paths and parameters
4. Press Enter or click green "Navigate" button

### For API Testing:
1. Click extension icon
2. Enter API endpoint URL
3. Select HTTP method
4. Go to "📋 Headers & Body" tab
5. Add headers and request body
6. Click "🚀 Send Request"
7. View response in new tab!

---

## 🐛 Bug Fixes

- Fixed null pointer errors in URL display
- Resolved timing issues with response viewer
- Fixed CSP violations with inline scripts
- Corrected initialization order problems
- Fixed URL wrapping in response viewer
- Improved error handling throughout

---

## 📝 Known Limitations

- **CORS Errors**: Cannot bypass browser CORS restrictions (by design)
- **Binary Data**: Cannot send files (use Postman for file uploads)
- **WebSocket**: Not supported (HTTP/HTTPS only)
- **Chrome Pages**: Cannot test on chrome:// internal pages

---

## 🔮 What's Next?

We're already working on v3.0 with exciting features:

- **Request Collections**: Save and organize your API calls
- **Environment Variables**: Switch between dev/staging/prod
- **GraphQL Support**: Query builder for GraphQL APIs
- **Import/Export**: Share requests with your team
- **Response History**: View previous responses
- **Code Generation**: Export as curl, fetch, or axios

---

## 💬 Feedback

We'd love to hear from you!

- **Found a bug?** Please report it
- **Have a feature idea?** We're listening
- **Enjoying the extension?** Leave a review! ⭐

---

## 🙏 Thank You

Thank you for using Quick URL Editor! This major update represents months of work to bring you a tool that's:

- **Fast**: No server round trips
- **Private**: All data stays local
- **Powerful**: Full API testing capabilities
- **Free**: No premium tiers or paywalls

Happy testing! 🚀

---

**Version**: 2.0  
**Release Date**: 2024  
**Manifest**: V3  
**Browser**: Chrome/Edge

