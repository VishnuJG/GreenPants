# 🧪 Testing Guide - Quick URL Editor

## Quick Start - Loading the Extension

1. **Open Chrome** and navigate to `chrome://extensions/`
2. **Enable Developer Mode** (toggle in the top-right corner)
3. **Click "Load unpacked"**
4. **Select the GreenPants directory** (the folder containing `manifest.json`)
5. **Verify the extension appears** in your extensions list
6. **Pin the extension** to your toolbar (click the puzzle icon, find "Quick URL Editor", click the pin icon)

## 🧪 Manual Testing Checklist

### ✅ Basic Functionality Tests

#### 1. Extension Loading
- [ ] Extension icon appears in toolbar
- [ ] Clicking icon opens popup (`hello.html`)
- [ ] Popup displays at correct size (700x600px)
- [ ] No console errors when opening popup
- [ ] Theme loads correctly (check colors match expected theme)

#### 2. URL Builder Tab (Default)
- [ ] Current page URL is automatically loaded
- [ ] Protocol dropdown shows current protocol (http/https)
- [ ] Host input shows current domain
- [ ] Path segments are parsed and displayed
- [ ] Query parameters are parsed and displayed
- [ ] Hash/fragment is displayed if present

**URL Editing Tests:**
- [ ] Can edit protocol (http ↔ https)
- [ ] Can edit host (type new domain)
- [ ] Can add path segment (click "Add Segment")
- [ ] Can remove path segment (click delete/X button)
- [ ] Can drag path segments to reorder
- [ ] Can add query parameter (key + value)
- [ ] Can remove query parameter
- [ ] Can edit query parameter values
- [ ] Live preview URL updates as you type

**Navigation Tests:**
- [ ] Click "🌐 Navigate" button navigates to edited URL
- [ ] Press Enter key navigates (global Enter handler)
- [ ] Navigate button is green with enter symbol (↵)
- [ ] Navigation works with modified URLs
- [ ] Navigation preserves hash/fragment

#### 3. Headers & Body Tab
- [ ] Tab appears in dropdown menu
- [ ] Can switch to "📋 Headers & Body" tab
- [ ] Headers section displays with "+ Add Header" button
- [ ] Body section displays with type selector

**Headers Tests:**
- [ ] Can add new header row
- [ ] Can enter header key and value
- [ ] Can remove header row
- [ ] Default headers (if any) are pre-populated correctly
- [ ] Headers persist when switching tabs

**Body Type Tests:**
- [ ] Can select "JSON" body type
- [ ] Can select "Form Data" body type
- [ ] Can select "Raw" body type
- [ ] Can select "None" body type
- [ ] JSON validation works (shows error for invalid JSON)
- [ ] Form data displays key-value pairs correctly

**HTTP Method Tests:**
- [ ] Method selector shows all methods: GET, POST, PUT, DELETE, PATCH
- [ ] Methods are color-coded correctly
- [ ] Selecting method updates UI hints
- [ ] GET method suggests "None" for body
- [ ] POST/PUT/PATCH suggest JSON/Form/Raw
- [ ] DELETE suggests "None" for body

#### 4. API Request Testing

**GET Request:**
- [ ] Enter API URL (e.g., `https://jsonplaceholder.typicode.com/posts/1`)
- [ ] Select GET method
- [ ] Click "🚀 Send Request"
- [ ] Response opens in new tab
- [ ] Status badge shows green (success) or red (error)
- [ ] Response body displays formatted JSON
- [ ] Headers tab shows response headers
- [ ] Raw tab shows complete raw response

**POST Request:**
- [ ] Enter API URL (e.g., `https://jsonplaceholder.typicode.com/posts`)
- [ ] Select POST method
- [ ] Add headers (e.g., `Content-Type: application/json`)
- [ ] Select JSON body type
- [ ] Enter JSON data: `{"title": "Test", "body": "Test body", "userId": 1}`
- [ ] Click "🚀 Send Request"
- [ ] Response shows 201 Created or appropriate status
- [ ] Response body shows created resource

**PUT/PATCH Request:**
- [ ] Test PUT with JSON body
- [ ] Test PATCH with JSON body
- [ ] Verify correct method is sent
- [ ] Verify body is included in request

**DELETE Request:**
- [ ] Test DELETE method
- [ ] Verify no body is sent (even if body is selected)
- [ ] Verify correct status code (usually 200 or 204)

**Error Handling:**
- [ ] Invalid URL shows appropriate error
- [ ] Network errors are handled gracefully
- [ ] CORS errors show clear message
- [ ] Invalid JSON shows validation error before sending
- [ ] Timeout errors are handled

#### 5. Response Viewer Tab

**Display Tests:**
- [ ] Response opens in dedicated Chrome tab (not popup)
- [ ] Tab title shows "API Response" or similar
- [ ] Status badge is color-coded (green=2xx, red=4xx/5xx)
- [ ] Duration is displayed in milliseconds
- [ ] Full URL is displayed and properly wrapped (no overflow)
- [ ] HTTP method is displayed

**Tab Navigation:**
- [ ] Can switch between "Response Body", "Headers", "Raw" tabs
- [ ] Response Body tab shows formatted JSON
- [ ] Headers tab shows all response headers
- [ ] Raw tab shows complete raw response text

**Copy Functionality:**
- [ ] "Copy Headers" button copies headers to clipboard
- [ ] "Copy Body" button copies body to clipboard
- [ ] Copy buttons work from all tabs
- [ ] Copied data is correct (verify by pasting)

#### 6. Tab Management (Smart Sorting)

**Usage Tracking:**
- [ ] Open extension multiple times
- [ ] Use "Headers & Body" tab frequently
- [ ] Verify it moves to top of dropdown
- [ ] Tabs reorder based on usage frequency
- [ ] Last used tab is remembered (opens to it next time)

**Tab Dropdown:**
- [ ] Dropdown shows all available tabs
- [ ] Can select any tab from dropdown
- [ ] Current tab is highlighted in dropdown
- [ ] Tab switching works smoothly

#### 7. History & Suggestions

**URL History:**
- [ ] Navigated URLs appear in history
- [ ] Copied URLs appear in history
- [ ] History shows badges ("navigated" or "copied")
- [ ] Clicking history item loads URL into editor
- [ ] "Clear History" button removes all history
- [ ] History section is collapsible

**Quick Insert Suggestions:**
- [ ] Recently used path segments appear as chips
- [ ] Recently used query parameters appear as chips
- [ ] Clicking segment chip adds it to path
- [ ] Clicking parameter chip adds it to query params
- [ ] "Clear Suggestions" button removes all suggestions
- [ ] Suggestions section is collapsible

#### 8. Timestamp Viewer Feature

**Content Script Tests:**
- [ ] Navigate to any webpage with Unix timestamps
- [ ] Timestamps are automatically detected and converted
- [ ] Hover shows readable date format
- [ ] Multiple format options work
- [ ] Toggle on/off works without page reload
- [ ] Works on dynamically loaded content

#### 9. Keyboard Shortcuts

- [ ] **Enter key**: Navigates from anywhere (except when typing in text fields)
- [ ] **Tab key**: Navigates between form fields
- [ ] **Escape key**: Closes extension popup
- [ ] Enter key doesn't trigger when editing text inputs
- [ ] Enter key triggers when focused on buttons

#### 10. URL Display (Collapsible)

- [ ] URL is visible at top of popup
- [ ] URL section is collapsible
- [ ] Collapsed state persists
- [ ] URL wraps properly for long URLs
- [ ] Click to expand/collapse works

### 🔍 Edge Cases & Error Testing

#### Invalid Inputs:
- [ ] Empty URL
- [ ] Invalid protocol
- [ ] Malformed host (e.g., "not a url")
- [ ] Invalid JSON in body
- [ ] Empty headers (key or value)
- [ ] Special characters in path segments
- [ ] Special characters in query parameters
- [ ] Very long URLs
- [ ] URLs with many query parameters
- [ ] URLs with many path segments

#### Network Scenarios:
- [ ] Offline mode (no internet)
- [ ] Slow network (test timeout handling)
- [ ] CORS-protected APIs
- [ ] Self-signed SSL certificates
- [ ] Non-existent domains
- [ ] APIs that return non-JSON (HTML, XML, plain text)

#### Storage Tests:
- [ ] Clear browser data, verify extension still works
- [ ] Test with full storage quota (if possible)
- [ ] Verify history persists after closing browser
- [ ] Verify tab preferences persist

#### Browser Compatibility:
- [ ] Test on Chrome (latest)
- [ ] Test on Chrome Canary
- [ ] Test on Edge (Chromium-based)
- [ ] Verify Manifest V3 compatibility

### 🐛 Debugging Tips

1. **Open DevTools for Extension:**
   - Go to `chrome://extensions/`
   - Click "Service worker" or "Inspect views: popup.html"
   - Check Console for errors

2. **Check Storage:**
   - In extension DevTools, run: `chrome.storage.local.get(null, console.log)`
   - Verify history and suggestions are stored correctly

3. **Network Debugging:**
   - Open Network tab in DevTools
   - Send API request
   - Verify request method, headers, and body are correct

4. **Console Logs:**
   - Check for any console.error or console.warn messages
   - Verify no null pointer errors

### 📋 Pre-Release Testing Checklist

Before submitting to Chrome Web Store:

- [ ] Test all features on **fresh Chrome profile**
- [ ] Verify **no console errors** in extension popup
- [ ] Verify **no console errors** in response viewer tab
- [ ] Test on **multiple websites** (different domains)
- [ ] Test with **real APIs** (JSONPlaceholder, httpbin.org, etc.)
- [ ] Verify **all permissions are necessary** and justified
- [ ] Test **privacy** - verify no data sent to external servers
- [ ] Verify **manifest.json** is valid (check in Chrome Extensions page)
- [ ] Test **error scenarios** and edge cases
- [ ] Verify **responsive design** (popup doesn't overflow)
- [ ] Test **accessibility** (keyboard navigation works)

## 🚀 Automated Testing (Optional)

While manual testing is recommended for Chrome extensions, you can also set up automated tests:

### Recommended Tools:
- **Puppeteer** - For automated browser testing
- **Playwright** - Alternative to Puppeteer
- **Jest** - For unit testing JavaScript modules
- **Chrome Extension Testing** - Custom test setup

### Example Test Scenarios:
1. Load extension and verify popup opens
2. Test URL parsing and building
3. Test API request sending
4. Test response viewer opening
5. Test storage operations

## 📝 Test Results Template

```
Test Date: [Date]
Chrome Version: [Version]
Tester: [Name]

✅ Passed: [List]
❌ Failed: [List with details]
⚠️  Warnings: [List]
🐛 Bugs Found: [List with reproduction steps]

Overall Status: [Pass/Fail/Needs Work]
```

---

## Quick Test Commands

### Test API Endpoints:
- **GET**: `https://jsonplaceholder.typicode.com/posts/1`
- **POST**: `https://jsonplaceholder.typicode.com/posts`
- **PUT**: `https://jsonplaceholder.typicode.com/posts/1`
- **DELETE**: `https://jsonplaceholder.typicode.com/posts/1`
- **Error**: `https://httpbin.org/status/404`

### Test URL Editing:
- Complex URL: `https://api.example.com/v1/users/123/posts?page=1&limit=10&sort=date#comments`
- Simple URL: `https://example.com`
- Localhost: `http://localhost:3000/api/test`

---

**Happy Testing! 🎉**

