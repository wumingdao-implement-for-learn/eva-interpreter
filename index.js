let value = 100;
function calc(x, y) {
  let z = x + y;

  function inner(foo) {
    return value + (foo + z);
  }

  return inner;
}

const fn = calc(10, 20);

// fn(30);
console.log(fn(30));
