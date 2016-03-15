// Requires
var safeJson = require('./main');

// Setup test objects
var testObj1 = {
      foo: 'bar'
   },
   testObj2 = {
      yes: ['no', 'maybe'],
      wibble: testObj1
   };
testObj1.baz = testObj2;

// Perform test
var result = safeJson.stringify(testObj1),
   expected = '{"foo":"bar","baz":{"yes":["no","maybe"],"wibble":"$ref(baz.wibble)"}}';

// Handle results
if (result !== expected) {
   console.error('Expected "' + result + '" to match "' + expected + '"');
   process.exit(1);
}