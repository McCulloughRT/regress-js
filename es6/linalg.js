export function standardDeviation(vector) {
  const mean = vector.reduce((p,c) => p + c) / vector.length;
  const sq_err = vector.map(e => Math.pow((e - mean),2))
  const mse = sq_err.reduce((p,c) => p + c) / sq_err.length;
  const stdDev = Math.sqrt(mse);
  return stdDev;
}

export function zip(arrays) {
  return arrays[0].map(function(_,i) {
      return arrays.map(function(array){return array[i]})
  });
}

export function column(arr,n) {
  return arr.map(function(elem) {
    return elem[n];
  });
}

export function dot(arrayOne, arrayTwo) {
  return zip([arrayOne,arrayTwo])
  .map(function(elem){
    return elem[0] * elem[1];
  })
  .reduce(function(p,c){
    return p+c;
  });
}

export function randomArray(length, max){
  return Array.apply(null, Array(length)).map(function(_, i) {
    return Math.random();
  });
}
