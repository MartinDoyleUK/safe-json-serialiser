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

   // Define environment variables
   var Environment = {
      maxDepth: 10
   };

   // Define the module
   var module = {

      /**
       * Update the environment variables
       *
       * @instance
       * @param {Object} conf The updated values
       */
      configEnvironment: function(conf) {
         Object.keys(conf).forEach(function(key) {
            Environment[key] = conf[key];
         });
      },

      /**
       * Sanitise the data object
       *
       * @instance
       * @param {Object} obj The unsanitised data
       * @param {Object[]} ancestors The ancestors of this data object (to look up circular references)
       * @returns {Object} The sanitised data
       */
      sanitise: function(obj, ancestors) {
         var currAncestors = ancestors || {
               stack: [],
               path: ["$"]
            },
            currPath = currAncestors.path[currAncestors.path.length - 1],
            prevPath = currAncestors.path[currAncestors.path.length - 2],
            safeValue,
            stackPos;
         if (typeof obj === 'function') {
            safeValue = "[Function]";
         } else if (!obj || typeof obj !== 'object') {
            safeValue = obj;
         } else if (currAncestors.length === Environment.maxDepth) {
            safeValue = '[Max-depth (' + Environment.maxDepth + ') reached]';
         } else if (obj.constructor === Array) {
            safeValue = [];
            var sanitisedElem;
            for (var i = 0, j = obj.length; i < j; i++) {
               sanitisedElem = this.sanitise(obj[i], {
                  stack: currAncestors.stack,
                  path: currAncestors.path.concat(currPath + '[' + i + ']')
               });
               safeValue.push(sanitisedElem);
            }
         } else if ((stackPos = currAncestors.stack.indexOf(obj)) !== -1) {
            safeValue = {
               $circularRef: prevPath
            };
         } else {
            safeValue = {};
            Object.keys(obj).forEach(function(key) {
               safeValue[key] = this.sanitise(obj[key], {
                  stack: currAncestors.stack.concat(obj),
                  path: currAncestors.path.concat(currPath + "." + key)
               });
            }, this);
         }
         return safeValue;
      },

      /**
       * Safely stringify the supplied object (functions and circular references are converted to "[Function]" and "[Circular]" respectively).
       *
       * @instance
       * @param {Object} obj The object to be serialised
       * @param {Function} [replacer] The replacer function to be passed to JSON.stringify after the data is sanitised
       * @param {String|Number} [space] The spacer parameter to be passed to JSON.stringify after the data is sanitised
       * @returns {String} The JSONified data
       */
      stringify: function(obj, replacer, space) {
         var safeData = this.sanitise(obj);
         return JSON.stringify(safeData, replacer, space);
      }
   };

   // Return the public API for the module
   return module;
});