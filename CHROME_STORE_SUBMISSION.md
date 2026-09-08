# Chrome Web Store Submission Guide - Version 2.5

## Quick Copy-Paste Answers

### 1. Single Purpose Description
```
This extension provides URL editing and API testing capabilities in a unified interface. Users can visually edit URL components (protocol, host, paths, query parameters, hash), test REST APIs with custom headers and request bodies using all HTTP methods (GET, POST, PUT, DELETE, PATCH), and view formatted responses in a dedicated tab. All features work together to help developers and testers work efficiently with URLs and APIs.
```

### 2. Permission Justifications

#### activeTab justification:
```
Required to read the current tab's URL when the extension popup opens, allowing users to edit the URL of the page they are currently viewing. Also used to inject timestamp viewer functionality into web pages when enabled by the user.
```

#### tabs justification:
```
Required to create new tabs for displaying API response data in a dedicated viewer interface. This provides users with a full-screen view of API responses including headers and body data.
```

#### storage justification:
```
Required to store URL history, frequently used path segments/parameters, and user preferences (tab order, timestamp settings) locally on the user's device. Also used for temporary storage of API response data when communicating between extension pages. All data is stored locally using Chrome's storage API and never transmitted to external servers.
```

#### scripting justification:
```
Required to inject the timestamp viewer content script into web pages when the user enables the timestamp conversion feature. This allows automatic conversion of Unix timestamps to human-readable dates on any webpage.
```

#### host_permissions (<all_urls>) justification:
```
Required to make HTTP/HTTPS requests to any API endpoint specified by the user for API testing. Users can test APIs on any domain (localhost, internal networks, public APIs) with full control over request headers, methods, and body data.
```

### 3. Remote Code Usage
**Select:** ❌ No, I am not using Remote code

### 4. Data Collection
**Select:** ❌ NONE of the data types

Check all three certifications:
- ✅ I do not sell or transfer user data to third parties
- ✅ I do not use or transfer user data for purposes unrelated to my item's single purpose  
- ✅ I do not use or transfer user data to determine creditworthiness or for lending purposes

### 5. Privacy Policy
**Upload/Link:** See `PRIVACY_POLICY.md` in the extension package

You can also host it on GitHub Pages or any public URL and provide that link.

---

## Checklist Before Submission

- [x] Updated manifest.json to v2.0 with all permissions
- [x] Added tabs permission for response viewer
- [x] Added host_permissions for API testing
- [x] Updated PRIVACY_POLICY.md for v2.0
- [x] Updated README.md with all v2.0 features
- [ ] Test all features thoroughly:
  - [ ] URL editing and navigation
  - [ ] API testing (GET, POST, PUT, DELETE, PATCH)
  - [ ] Headers and body management
  - [ ] Response viewer in new tab
  - [ ] Tab usage tracking and sorting
  - [ ] Timestamp viewer
  - [ ] History and suggestions
- [ ] Take NEW screenshots showcasing v2.0 features
- [ ] Prepare promotional images highlighting API testing
- [ ] Test on fresh Chrome profile
- [ ] Verify no console errors

---

## Store Listing Tips

### Name
URL Editor Pro

### Short Description (132 characters max)
API testing + URL editing in one popup. JSON/YAML diff tools, param toggles, themes, custom headers, and a full-tab response viewer.

### Detailed Description Template
```
🚀 URL Editor Pro - Version 2.5

The ultimate tool for developers! Combines powerful URL editing with complete API testing capabilities - all in your browser.

✨ API TESTING:
• All HTTP Methods: GET, POST, PUT, DELETE, PATCH
• Custom Headers: Authorization, API keys, Content-Type, etc.
• Request Bodies: JSON (live validation), Form Data, Raw Text, or None
• JSON Editor: Format, minify, syntax highlighting, and expandable editor
• Response Viewer: Opens in a full Chrome tab with formatted output
• Status Indicators: Color-coded success/error badges
• Request Timing: See response duration
• Copy Buttons: One-click copy for headers and body
• Tabbed Response: Body, Headers, and Raw views

🔗 URL EDITING:
• Smart URL Builder: Edit paths and query params in one tab
• Inline Autocomplete: Suggestions for path segments, param keys, and values (arrow keys to select — no forced auto-fill)
• Param Toggle: Disable query params temporarily without deleting them; re-enable anytime
• Persistent Param State: Disabled params remembered per URL path across sessions
• Drag & Drop: Reorder path segments visually
• Protocol & Host: Full control over all URL components
• Real-time Preview: URL updates as you type
• Hash/Fragment: Edit URL anchors
• Smart Suggestions: Learn from recently used segments and parameters

🧰 DEVELOPER TOOLS (Full Chrome Tabs):
• JSON Diff: Side-by-side compare with color-coded line diffs
• JSON Diff History: Save, name, reload, rename, and delete comparisons
• JSON Share & Export: Copy share links (extension users) or export/import .jsondiff.json files
• YAML Tools: Compare two YAML files OR fix/format a single document
• YAML Fix Mode: Repair common issues, validate syntax, convert JSON → YAML, import .yaml files
• YAML History & Sharing: Same save/share/export workflow as JSON Diff
• Quick Access: JSON Diff and YAML Diff buttons in the top bar — always one click away

🎯 SMART FEATURES:
• Last Tab Memory: Opens where you left off
• Keyboard Shortcuts: Alt+1–4 (Ctrl+1–4 on Mac) for quick tab switching
• Enter to Navigate: Press Enter to apply the edited URL to the current tab
• Shift+Enter: Open the edited URL in a new tab
• Configurable Storage Limits: Adjust URL history and suggestion pool size in Settings
• Collapsible Sections: Clean, organized interface
• Timestamp Viewer: Convert Unix timestamps on any page

🎨 PROFESSIONAL UI:
• 5 Built-in Themes: Light, Dark, Golden, Silver, and Crystal
• Theme-aware design across popup, response viewer, and diff tools
• Top tab bar for fast section navigation
• Color-coded HTTP method badges
• Responsive layouts with proper text wrapping

🔒 PRIVACY & SECURITY:
• 100% Local Storage: All data on YOUR device
• NO Data Collection: Zero tracking or analytics
• NO External Servers: No data transmission
• Open Source: Transparent, auditable code
• Self-Contained: Pure JavaScript with a vendored offline YAML parser (no CDN calls)

💡 USE CASES:
• REST API Testing & Development
• Quick API endpoint verification
• Testing with custom authentication headers
• JSON & YAML payload validation and comparison
• URL manipulation for testing scenarios
• Path and parameter experimentation
• API documentation and debugging
• Integration testing
• Config file diffing (JSON/YAML)

🛠️ TECHNICAL DETAILS:
• Manifest V3 (modern Chrome extensions)
• Modular ES6 architecture
• Comprehensive error handling
• Chrome Storage API for history, suggestions, param state, and diff saves
• Dedicated full-tab tools: response viewer, JSON diff, YAML diff

📊 PERFECT FOR:
• Backend Developers
• Frontend Developers
• QA Engineers
• API Developers
• DevOps Engineers
• Technical Writers
• Anyone working with REST APIs

🎁 BONUS FEATURES:
• URL History: Track and reload past URLs (configurable limit)
• Inline Autocomplete: Quick insertion from usage history (configurable pool size)
• Timestamp Conversion: Unix to readable dates
• Multiple Format Support: ISO 8601, RFC 2822, Custom
• JSON/YAML Diff Shortcuts: Cmd/Ctrl+Enter to compare, Cmd/Ctrl+S to save

Transform your API testing workflow! Say goodbye to Postman for quick tests and hello to instant, browser-integrated API testing.
```

### Screenshots Needed (1280x800 or 640x400)

#### Priority Screenshots:
1. **API Testing in Action** - Headers & Body tab with POST request setup
2. **Response Viewer** - Full tab showing formatted JSON response with status
3. **URL Builder** - Combined paths and query params with enable/disable toggles
4. **JSON Diff & YAML Tools** - Side-by-side diff with saved comparison history
5. **HTTP Method Selector** - All methods (GET, POST, PUT, DELETE, PATCH) visible
6. **Theme Selector** - Showing Light, Dark, Golden, Silver, and Crystal themes

#### Additional Screenshots:
7. YAML Fix mode — format/repair a single YAML document
8. Timestamp viewer feature on a webpage
9. History section with saved URLs and storage limit settings
10. Advanced/Settings tab with protocol/host editing
11. Response viewer showing error handling (red status)
12. Top bar with JSON Diff and YAML Diff quick-launch buttons

### Promotional Images (Optional but Recommended)
- **Main Banner**: "Test APIs Right in Your Browser"
- **Feature Highlight**: Split view showing API testing + URL editing
- **Before/After**: Manual curl vs. Visual API testing

### Category
**Primary**: Developer Tools
**Secondary**: Productivity (if available)

### Language
English

### Target Audience
Developers, QA Engineers, API Testers, DevOps Engineers

### Tags/Keywords (if supported)
api, rest, testing, url, editor, developer, tools, http, headers, json, yaml, diff, postman, alternative

---

## After Approval

1. **Share the extension link** on:
   - GitHub repository
   - Twitter/X
   - LinkedIn
   - Dev.to or Hashnode
   - Reddit (r/webdev, r/chrome_extensions)
   
2. **Monitor user feedback**:
   - Respond to reviews promptly
   - Track feature requests
   - Fix reported bugs quickly

3. **Marketing**:
   - Create demo video (optional)
   - Write blog post about v2.0 features
   - Share comparison with Postman/other tools

4. **Future Updates**:
   - Request collections
   - Environment variables
   - GraphQL support
   - Import/Export functionality

---

## Version History

### v2.5 - Current
**New in this release:**
- JSON Diff tool: side-by-side compare, named history, share links, export/import
- YAML Tools: Compare Diff + Fix YAML modes (format, validate, repair, JSON→YAML)
- Query param enable/disable toggles with per-path persistence across sessions
- Shift+Enter opens edited URL in a new tab
- Configurable URL history and suggestion pool limits in Settings
- Autocomplete no longer auto-selects first suggestion — use arrow keys to choose
- JSON Diff and YAML Diff quick-launch buttons in the top bar

### v2.4
**New in this release:**
- 5 built-in themes (Light, Dark, Golden, Silver, Crystal)
- Inline autocomplete for path segments and query param keys/values
- JSON editor with format, minify, live validation, and expand mode
- Top tab bar with keyboard shortcuts (Alt+1–4, Ctrl+1–4 on Mac)
- Consolidated Settings tab (protocol, host, hash, and history)
- Renamed to URL Editor Pro

**Removed / changed from earlier listings:**
- Dropdown tab selector (replaced by top tab bar)
- Tabs sorted by usage frequency (fixed tab order now)
- "Save and reuse API configurations" (not implemented)

### v2.0 - Major Update
**API Testing Features:**
- All HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Custom headers management
- Request body editor (JSON, Form, Raw)
- Response viewer in dedicated Chrome tab
- Formatted response with status codes
- Copy buttons for headers and body

**UI Improvements:**
- Combined URL Builder (paths + params)
- Global Enter key navigation
- Collapsible URL sections
- Proper text wrapping in response viewer

**Technical:**
- Chrome storage for tab communication
- Comprehensive null safety
- Better error handling
- Zero external dependencies

### v1.2
- Timestamp viewer feature
- URL history tracking
- Recent suggestions

### v1.0 - Initial Release
- URL component editing
- Path segment reordering
- Query parameter management
- Local history and suggestions
- Modern gradient UI

