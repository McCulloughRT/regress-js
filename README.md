# regress-js
A JavaScript (ES6) library for performing in-browser linear regression.

Uses gradient descent with residual sum of squared error to perform simple linear regression, polynomial regression, and multivariate polynomial regression.

## Usage:
Import the library with
~~~~
<script src='regress.js'></script>
~~~~
Then call the regress() function with your training data, step-size, convergence tolerance, and optionally the maximum iterations.
~~~~
var weights = regress(data, stepSize=1.5e-10, tolerence=1.0, maxIterations=1000);
~~~~
## Input:
Training data is expected to be in 2d matrix format with each row corresponding to a unique element (or observation) and each column corresponding to a feature of that element. The last column of the matrix is assumed to be the target variable to be predicted.

For example, if our goal was to predict how square footage effects the cost of a house, we would prepare a matrix with each row corresponding to a known house with house square footage as the first area of the row and house price as the second.
~~~~
var trainingData = [[2000,180000], // each row is a house
                    [1700,150000], // each column is a feature of the house
                    [3000,250000],
                    ...         ];
~~~~
## Return:
After completion the function will return an array of weights corresponding to the number of features in the input data, plus a learned constant (y-intercept) that will always be the first element of the array. These can be used in a linear equation to predict the target variable for new inputs.

For example, for a simple linear regression model the weights are utilized like so:
~~~~
var weights = [2.44, 0.48]; // output from regress()

// Function to predict y as a linear function of x, given x and a set of weights:
function predict(x, weights){
  var y = weights[0] + (weights[1] * x)
  return y;
});

console.log(predict(10)); // outputs 7.24
~~~~
This follows the form for a simple linear equation: y = a + bx

For more complicated regressions, such as multivariate polynomial regression, just be sure to keep track of the order of weights and apply them in the same order in your prediction function:
~~~~
var weights = [2.44, 0.48, 4.32, 2.87, 1.99];

function predict(x_1,x_2,x_3 weights){
  var y = weights[0] + (weights[1] * x_1) + (weights[2] * Math.pow(x_1, 2)) + (weights[3] * x_2) + (weights[4] * x_3); 
  return y;
});
~~~~
