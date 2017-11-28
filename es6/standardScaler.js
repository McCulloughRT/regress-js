import * as LinAlg from './linalg';

/* 
Scales a matrix of data feature-wise (columns) 
by subtracting the mean and dividing by the standard
deviation 
*/

export default class StandardScaler {
  constructor() {
    this.means = null;
    this.devs = null;
  }

  fit(data) {
    const means = [];
    const devs = [];

    for (var i = 0; i < data[0].length; i++) {
      const feature = LinAlg.column(data, i);
      const mean = feature.reduce((p,c) => p + c) / feature.length;
      const stddev = LinAlg.standardDeviation(feature);
      means.push(mean);
      devs.push(stddev);
    }
    this.means = means;
    this.devs = devs;
  }

  fitTransform(data) {
    this.fit(data);
    console.log(this.means);
    console.log(this.devs);
    const scaledData = this.transform(data);
    return scaledData;
  }

  transform(data) {
    if(this.means === null || this.devs === null) {
      console.error('Must fit data before transforming');
      return;
    }

    const scaledFeatures = [];
    for (var i = 0; i < data[0].length; i++) {
      const feature = LinAlg.column(data,i);
      const scaledFeature = feature.map(e => (e - this.means[i]) / this.devs[i]);
      scaledFeatures.push(scaledFeature);
    }
    return LinAlg.zip(scaledFeatures);
  }
}