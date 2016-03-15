// Requires
var safeJson = require('./main');

// Setup test objects
var testObj1 = {
      a: '1'
   },
   testObj2 = {
      b: [2, 3],
      c: testObj1,
      d: [{
         e: '4'
      }]
   };
testObj1.f = testObj2;
testObj2.d[0].g = testObj2.d[0];

// Perform test
var result = safeJson.stringify(testObj1),
   expected = '{"a":"1","f":{"b":[2,3],"c":{"$circularRef":"$.f"},"d":[{"e":"4","g":{"$circularRef":"$.f.d[0]"}}]}}';

// Handle results
if (result !== expected) {
   console.error('Expected "' + result + '" to match "' + expected + '"');
   process.exit(1);
}