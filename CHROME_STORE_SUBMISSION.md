# Chrome Web Store Submission Guide - Version 2.0

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
Quick URL Editor

### Short Description (132 characters max)
Full-featured API testing + URL editing. Test REST APIs with custom headers/bodies. All HTTP methods. Response viewer included.

### Detailed Description Template
```
🚀 Quick URL Editor - Version 2.0

The ultimate tool for developers! Combines powerful URL editing with complete API testing capabilities - all in your browser.

✨ API TESTING FEATURES (NEW!):
• All HTTP Methods: GET, POST, PUT, DELETE, PATCH
• Custom Headers: Authorization, API keys, Content-Type, etc.
• Request Bodies: JSON (validated), Form Data, Raw Text
• Response Viewer: Opens in full Chrome tab with formatted output
• Status Indicators: Color-coded success/error badges
• Request Timing: See response duration
• Copy Buttons: One-click copy for headers and body
• Tabbed Response: Body, Headers, and Raw views

🔗 URL EDITING FEATURES:
• Smart URL Builder: Edit paths and query params in one tab
• Drag & Drop: Reorder path segments visually
• Protocol & Host: Full control over all URL components
• Real-time Preview: URL updates as you type
• Hash/Fragment: Edit URL anchors
• Quick Suggestions: Recently used segments and parameters

🎯 SMART FEATURES (NEW!):
• Tab Usage Tracking: Most-used tabs appear first
• Last Tab Memory: Opens where you left off
• Enter Key Navigation: Press Enter to navigate quickly
• Collapsible Sections: Clean, organized interface
• Timestamp Viewer: Convert Unix timestamps on any page

🎨 PROFESSIONAL UI:
• Modern gradient design with smooth animations
• Dropdown tab selector for clean navigation
• Green "Navigate" button with enter symbol
• Color-coded HTTP method badges
• Responsive layouts with proper text wrapping

🔒 PRIVACY & SECURITY:
• 100% Local Storage: All data on YOUR device
• NO Data Collection: Zero tracking or analytics
• NO External Servers: No data transmission
• Open Source: Transparent, auditable code
• No Dependencies: Pure JavaScript

💡 USE CASES:
• REST API Testing & Development
• Quick API endpoint verification
• Testing with custom authentication headers
• JSON payload validation
• URL manipulation for testing scenarios
• Path and parameter experimentation
• API documentation and debugging
• Integration testing
• Save and reuse API configurations

🛠️ TECHNICAL DETAILS:
• Manifest V3 (modern Chrome extensions)
• Modular ES6 architecture
• Zero external dependencies
• Comprehensive error handling
• Chrome Storage API for data
• Dedicated response viewer tab

📊 PERFECT FOR:
• Backend Developers
• Frontend Developers
• QA Engineers
• API Developers
• DevOps Engineers
• Technical Writers
• Anyone working with REST APIs

🎁 BONUS FEATURES:
• URL History: Track your API calls
• Recent Suggestions: Quick parameter insertion
• Timestamp Conversion: Unix to readable dates
• Multiple Format Support: ISO 8601, RFC 2822, Custom

Transform your API testing workflow! Say goodbye to Postman for quick tests and hello to instant, browser-integrated API testing.
```

### Screenshots Needed (1280x800 or 640x400)

#### Priority Screenshots:
1. **API Testing in Action** - Headers & Body tab with POST request setup
2. **Response Viewer** - Full tab showing formatted JSON response with status
3. **URL Builder** - Combined paths and query params in one view
4. **HTTP Method Selector** - All methods (GET, POST, PUT, DELETE, PATCH) visible
5. **Smart Tab Dropdown** - Showing usage counts and sorted tabs

#### Additional Screenshots:
6. Timestamp viewer feature on a webpage
7. History section with saved URLs
8. Advanced tab with protocol/host editing
9. Response viewer showing error handling (red status)
10. Copy buttons and tabbed response interface

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
api, rest, testing, url, editor, developer, tools, http, headers, json, postman, alternative

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

### v2.0 - Major Update (Current)
**API Testing Features:**
- All HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Custom headers management
- Request body editor (JSON, Form, Raw)
- Response viewer in dedicated Chrome tab
- Formatted response with status codes
- Copy buttons for headers and body

**UI Improvements:**
- Smart tab dropdown with usage tracking
- Combined URL Builder (paths + params)
- Global Enter key navigation
- Green Navigate button
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

