/*globals define,module,JSON*/
// Module/Plugin core
// Note: the wrapper code you see around the module is what enables
// us to support multiple module formats and specifications by 
// mapping the arguments defined to what a specific format expects
// to be present. Our actual module functionality is defined lower 
// down, where a named module and exports are demonstrated. 
(function(name, definition) {
   var theModule = definition(),
      // this is considered "safe":
      hasDefine = typeof define === 'function' && define.amd,
      // hasDefine = typeof define === 'function',
      hasExports = typeof module !== 'undefined' && module.exports;

   if (hasDefine) { // AMD Module
      define(theModule);
   } else if (hasExports) { // Node.js Module
      module.exports = theModule;
   } else { // Assign to common namespaces or simply the global object (window)
      (this.jQuery || this.ender || this.$ || this)[name] = theModule;
   }
})('safe-json-serialiser', function() {

   // Define the module
   var module = {};
   module.stringify = function(obj) {
      console.error('Awooga!');
   };

   // Return the public API for the module
   return module;
});


// function safelyJsonify(obj, opts) {

//    // Create the safe object
//    var safeObj = (function makeSafe(unsafe, ancestors) {
//       /*jshint maxcomplexity:false,maxstatements:false*/

//       // Setup return value
//       var safeValue = {};

//       // Deal with data appropriately
//       if (typeof unsafe === 'function') {

//          // Ignore functions
//          var functionName = unsafe.name && unsafe.name + '()';
//          safeValue = functionName || 'function';

//       } else if (!unsafe || typeof unsafe !== 'object') {

//          // Falsy values and non-objects are already safe
//          safeValue = unsafe;

//       } else if (unsafe.constructor === Array) {

//          // Arrays are safe in themselves, but make their items safe
//          safeValue = unsafe.map(function(unsafeChild) {
//             return makeSafe(unsafeChild, ancestors);
//          });

//       } else if (ancestors.indexOf(unsafe) !== -1) {

//          // Recursion avoidance!
//          safeValue = '[recursive object]';

//       } else if (opts.maxDepth !== -1 && ancestors.length === opts.maxDepth) {

//          // Handle max-depth exceptions
//          safeValue = '[object beyond max-depth]';

//       } else {

//          // A normal object, so recurse through its properties
//          var keys = Object.keys(unsafe),
//             key,
//             value;
//          for (var i = 0; i < keys.length; i++) {

//             // Variables
//             key = keys[i];
//             try {
//                value = unsafe[key];
//             } catch (e) {
//                value = 'Error (see console for details): ' + e.message;
//                console.warn('Unable to access \'' + key + '\' property on object: ', unsafe);
//             }

//             // Check against max children
//             if (opts.maxChildren !== -1 && i === opts.maxChildren) {
//                safeValue['MAXIMUM CHILDREN'] = 'Maximum child-property count reached';
//                break;
//             }

//             // Ensure key isn't explicitly excluded
//             if (opts.excludedKeys.indexOf(key) !== -1) {
//                safeValue[key] = '[key excluded]';
//                continue;
//             }

//             // Make the value safe before adding to the return object
//             safeValue[key] = makeSafe(value, ancestors.concat(unsafe));
//          }
//       }

//       // If we end up with a string, make the linebreaks safe
//       if (typeof safeValue === 'string') {
//          safeValue = safeValue.replace(/\r/g, '').replace(/\n/g, '\\n');
//       }

//       // Pass back the safe object
//       return safeValue;

//    })(obj, []);

//    // Pass back the safely JSONified object
//    return JSON.stringify(safeObj, null, 2);
// }