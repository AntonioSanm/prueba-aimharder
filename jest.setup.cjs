require('@testing-library/jest-dom');
const jQuery = require('jquery');

// Mock window.confirm
global.window = global.window || {};
global.window.confirm = jest.fn().mockReturnValue(true);

// Mock jQuery for testing
global.$ = global.jQuery = jQuery;

// Mock DOM elements
global.document.body.innerHTML = `
    <div id="app"></div>
`;

// Mock jQuery event handling
jQuery.fn.on = function(event, callback) {
    this[0].addEventListener(event, callback);
};

jQuery.fn.trigger = function(event) {
    const customEvent = new CustomEvent(event.type, { detail: event.detail });
    this[0].dispatchEvent(customEvent);
};

// Create a mock CustomEvent constructor if it doesn't exist
global.CustomEvent = function(event, params) {
  params = params || { bubbles: false, cancelable: false, detail: undefined };
  const evt = document.createEvent('CustomEvent');
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
};

// Add CustomEvent to window if it doesn't exist
if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = global.CustomEvent;
}
