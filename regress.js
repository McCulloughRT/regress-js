// ===========================================
//              RegressJS
// A library for performing linear regression
// in browser with javascript
// Created by: Ryan McCullough
// ============================================

function regression(inputData, stepSize, tolerance, maxIterations=1000){
  console.log('starting regression');
  var trainData = JSON.parse(JSON.stringify(inputData));
  var currentIteration = 0;
  var features = buildFeatures(trainData);
  var data = features.data;
  var target = features.targets;

  var weights = randomArray(data[0].length,10);
  var converged = false;

  while(!converged){
    currentIteration++;
    console.log('Iter: ' + currentIteration);
    var predictions = predictOutput(data, weights);
    var errors = computeError(predictions, target);

    // Initialize the sum of squares for gradient descent
    var gradientSumSquares = 0;

    for (var i = 0; i < weights.length; i++) {
      var derivative_i = featureDerivative(errors, column(data,i));
      gradientSumSquares += Math.pow(derivative_i,2);
      weights[i] = weights[i] - (stepSize * derivative_i);
    }

    var gradientMagnitude = Math.sqrt(gradientSumSquares);
    console.log(String(gradientMagnitude) + " !< " + String(tolerance));
    if ((gradientMagnitude < tolerance) || (currentIteration > maxIterations)){
      console.log('exiting regression');
      converged = true;
    }
  }
  return weights;
}

function featureDerivative(errors, feature){
  return 2*(dot(errors, feature));
}

function buildFeatures(dataset){
  // Add a constant y-intercept feature to the first index of each observation
  // Remove the last index of each observation and save it as target_i
  var clone_data = JSON.parse(JSON.stringify(dataset));
  var target = [];
  for (var i = 0; i < clone_data.length; i++) {
    clone_data[i].unshift(1.0);
    var target_i = clone_data[i].pop();
    target.push(target_i);
  }

  return {
    data: clone_data,
    targets: target
  };
}

function computeError(predictions, output){
  return zip([predictions, output])
  .map(function(elem){
    return elem[0] - elem[1];
  });
}

function predictOutput(data, weights){
  // For each observation in data, compute dot product of
  // observation vector and weight vector
  var predictions = [];
  for (var i = 0; i < data.length; i++) {
    predictions.push(dot(data[i], weights));
  }
  return predictions;
}

function dot(arrayOne, arrayTwo){
  return zip([arrayOne,arrayTwo])
  .map(function(elem){
    return elem[0] * elem[1];
  })
  .reduce(function(p,c){
    return p+c;
  });
}

function column(arr, n){
  return arr.map(function(elem){
    return elem[n];
  });
}

function zip(arrays){
  return arrays[0].map(function(_,i){
      return arrays.map(function(array){return array[i]})
  });
}

function randomArray(length, max){
  return Array.apply(null, Array(length)).map(function(_, i) {
    return Math.round(Math.random() * max);
  });
}
