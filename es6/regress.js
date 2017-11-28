import * as LinAlg from './linalg';

export default class LinearRegression {
  constructor(props) {
    this.model = props || {
      verbose: false,
      stepSize: 1e-3,
      tolerence: 1.0,
      maxIterations: 1000,
      weights: null
    };
  }

  fit(train_x, train_y, biasIncluded=false) {
    if (biasIncluded) {
      this._regression(train_x, train_y);
      return;
    }
    // add a bias
    const train_x_bias = this._addIntercept(train_x);
    this._regression(train_x_bias, train_y);
  }

  fit_predict(train_x, train_y) {
    // add a bias
    const train_x_bias = this._addIntercept(train_x);
    this.fit(train_x_bias, train_y, true);
    return this.predict(train_x_bias, true);
  }

  predict(data, biasIncluded=false) {
    if (this.weights === null) {
      console.error('Must fit data before predicting');
      return;
    }

    if (biasIncluded) {
      return data.map(e => LinAlg.dot(e, this.model.weights));
    } else {
      const data_bias = this._addIntercept(data);
      return data_bias.map(e => LinAlg.dot(e, this.model.weights));
    }
  }

  _regression(train_x, train_y) {
    console.log('starting regression');
    
    this.model.weights = LinAlg.randomArray(train_x[0].length, 0.1);

    let currentIteration = 0;
    let weights = this.model.weights;

    let converged = false;

    while(!converged){
      currentIteration++;
      const predictions = this.predict(train_x, weights);
      const errors = this._computeError(predictions, train_y);

      if(currentIteration % 500 == 0 && this.model.verbose){
        // print the mean squared error:
        const sqerr = errors.map(e => Math.pow(e,2));
        const mse = sqerr.reduce((p,c) => p + c) / sqerr.length;
        console.log(mse);
      }

      // Initialize the sum of squares for gradient descent
      let gradientSumSquares = 0;
      // Update each weight iteratively
      for (let i = 0; i < weights.length; i++) {
        const derivative_i = this._featureDerivative(errors, LinAlg.column(train_x,i));
        gradientSumSquares += Math.pow(derivative_i,2);
        weights[i] = weights[i] - (this.model.stepSize * derivative_i);
      }

      const gradientMagnitude = Math.sqrt(gradientSumSquares);

      // Exit regression if tolerence or max iterations are reached
      if ((gradientMagnitude < this.model.tolerance) || (currentIteration > this.model.maxIterations)){
        console.log('exiting regression');
        console.log(weights);
        converged = true;
      }
    }
    this.model.weights = weights;
  }

  _computeError(predicted, truth) {
    return LinAlg.zip([predicted, truth])
    .map(e => (e[0] - e[1]));
  }

  _addIntercept(data) {
    const cloneData = JSON.parse(JSON.stringify(data));
    for (var i = 0; i < cloneData.length; i++) {
      cloneData[i].unshift(1.0);
    }
    return cloneData;
  }

  _featureDerivative(errors, feature) {
    return 2*(LinAlg.dot(errors, feature));
  }
}
