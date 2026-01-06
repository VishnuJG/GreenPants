// Request Body Management

let currentBodyType = 'json';

// Initialize body management
export function initBodyManager() {
  const bodyTypeButtons = document.querySelectorAll('.body-type-btn');
  const bodyEditor = document.getElementById('bodyEditor');
  
  bodyTypeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      bodyTypeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBodyType = btn.dataset.bodyType;
      updateBodyPlaceholder();
    });
  });
  
  updateBodyPlaceholder();
}

// Update placeholder based on body type
function updateBodyPlaceholder() {
  const bodyEditor = document.getElementById('bodyEditor');
  
  const placeholders = {
    json: '{\n  "key": "value",\n  "name": "John Doe"\n}',
    form: 'key1=value1\nkey2=value2\nname=John Doe',
    raw: 'Enter raw text here...',
    none: ''
  };
  
  if (bodyEditor) {
    bodyEditor.placeholder = placeholders[currentBodyType] || '';
    
    // Disable editor for 'none' type
    if (currentBodyType === 'none') {
      bodyEditor.disabled = true;
      bodyEditor.value = '';
    } else {
      bodyEditor.disabled = false;
    }
  }
}

// Get current body type
export function getBodyType() {
  return currentBodyType;
}

// Get body content based on type
export function getBody() {
  const bodyEditor = document.getElementById('bodyEditor');
  
  if (!bodyEditor || currentBodyType === 'none') {
    return null;
  }
  
  const content = bodyEditor.value.trim();
  
  if (!content) {
    return null;
  }
  
  switch (currentBodyType) {
    case 'json':
      try {
        // Validate JSON
        JSON.parse(content);
        return content;
      } catch (e) {
        throw new Error('Invalid JSON format: ' + e.message);
      }
    
    case 'form':
      // Convert form data to URLSearchParams format
      return content;
    
    case 'raw':
      return content;
    
    default:
      return null;
  }
}

// Set body content
export function setBody(content, type = 'json') {
  const bodyEditor = document.getElementById('bodyEditor');
  const bodyTypeButtons = document.querySelectorAll('.body-type-btn');
  
  if (bodyEditor) {
    bodyEditor.value = content || '';
  }
  
  // Set body type
  if (type) {
    currentBodyType = type;
    bodyTypeButtons.forEach(btn => {
      if (btn.dataset.bodyType === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    updateBodyPlaceholder();
  }
}

// Clear body
export function clearBody() {
  const bodyEditor = document.getElementById('bodyEditor');
  if (bodyEditor) {
    bodyEditor.value = '';
  }
}

// Get Content-Type header based on body type
export function getContentTypeHeader() {
  switch (currentBodyType) {
    case 'json':
      return 'application/json';
    case 'form':
      return 'application/x-www-form-urlencoded';
    case 'raw':
      return 'text/plain';
    default:
      return null;
  }
}

