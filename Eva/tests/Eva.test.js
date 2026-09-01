import { describe, it, expect } from "vitest";
import { Eva } from "../src/Eva";
import evaParser from "../parser/evaParser.cjs";

/**
 * Expr ::= Number | String | [+ Number Number] | [+ Expr Expr]
 */

const eva = new Eva();

const parser = (code) => evaParser.parse(code);

describe("Test self-evaluating expressions", () => {
  it("should check numbers for self-evaluation", () => {
    expect(eva.eval(1)).toBe(1);
    expect(eva.eval(0)).toBe(0);
    expect(eva.eval(-1)).toBe(-1);
  });

  it("should check string for self-evaluation", () => {
    expect(eva.eval('"hello"')).toBe("hello");
  });
});

describe("Implement Binary Operators", () => {
  // Math
  it("should implement addition for numbers", () => {
    expect(eva.eval(["+", 1, 2])).toBe(3);
    expect(eva.eval(["+", ["+", 3, 2], 5])).toBe(10);
    expect(eva.eval(["-", 1, 0])).toBe(1);
  });

  // Comparison
  it("should implement less than for numbers", () => {
    expect(eva.eval(["<", 1, 2])).toBe(true);
    expect(eva.eval(["<", 2, 1])).toBe(false);

    console.log(eva.eval(["=", "true", "false"]));
  });

  // Logical
  it("should implement logical for &&", () => {
    expect(eva.eval(["&&", "true", "true"])).toBe(true);
    expect(eva.eval(["&&", "true", "false"])).toBe(false);
    expect(eva.eval(["&&", "false", "false"])).toBe(false);

    expect(eva.eval(["begin", ["var", "x", 10], ["&&", [">", "x", 5], ["=", "x", 10]]])).toBe(true);
    expect(eva.eval(["begin", ["var", "x", 10], ["and", [">", "x", 5], ["=", "x", 10]]])).toBe(
      true,
    );
  });

  it("should implement logical for ||", () => {
    expect(eva.eval(["||", "true", "true"])).toBe(true);
    expect(eva.eval(["or", "true", "false"])).toBe(true);
  });

  it("should implement logical for not", () => {
    expect(eva.eval(["not", "true"])).toBe(false);
    expect(eva.eval(["!", "true"])).toBe(false);
  });
});

describe("Implement Variables", () => {
  it("should implement definition of variables", () => {
    expect(eva.eval(["var", "x", 1])).toBe(1);
  });

  it("should implement access of variables", () => {
    eva.eval(["var", "x", 1]);
    expect(eva.eval("x")).toBe(1);
  });

  it("should acces global variables", () => {
    expect(eva.eval("null")).toBe(null);
    expect(eva.eval("true")).toBe(true);
    expect(eva.eval("false")).toBe(false);
    expect(eva.eval("VERSION")).toBe("0.0.1");
  });

  it("should storage true", () => {
    expect(eva.eval(["var", "x", "true"])).toBe(true);
    expect(eva.eval("x")).toEqual(true);
  });

  it("should correctly complex expression with variables", () => {
    expect(eva.eval(["var", "x", ["+", 1, 2]])).toBe(3);
  });
});

describe("Implement Block Scope", () => {
  it("should begin block scope", () => {
    expect(
      eva.eval(["begin", ["var", "x", 10], ["var", "y", 20], ["+", ["*", "x", "y"], 30]]),
    ).toBe(230);
  });

  it("should not access variables outside block scope", () => {
    expect(eva.eval(["begin", ["var", "x", 10], ["begin", ["var", "x", 20], "x"], "x"])).toBe(10);
  });

  it("should access variables of parent block scope", () => {
    expect(eva.eval(["begin", ["var", "x", 10], ["begin", "x"]])).toBe(10);
  });

  it("should assign variables", () => {
    expect(eva.eval(["begin", ["var", "x", 10], ["begin", ["set", "x", 20], "x"]])).toBe(20);
  });
});

describe("Implement Conditional Expressions", () => {
  it("should implement if expression", () => {
    expect(
      eva.eval([
        "begin",
        ["var", "x", 10],
        ["var", "y", 0],
        ["if", [">", "x", "y"], ["set", "y", 10], ["set", "y", 20]],
        "y",
      ]),
    ).toBe(10);
  });

  it("should implement while expression", () => {
    expect(
      eva.eval([
        "begin",
        ["var", "counter", 0],
        ["var", "result", 0],

        [
          "while",
          ["<", "counter", 10],
          // result++
          // TODO: implement ["++", <Expr>]

          ["begin", ["set", "result", ["+", "result", 1]], ["set", "counter", ["+", "counter", 1]]],
        ],
        "result",
      ]),
    ).toBe(10);
  });
});

describe("Implement Parser", () => {
  it("should parse expression", () => {
    const code = "(+ 2 10)";
    const expr = evaParser.parse(code);
    expect(eva.eval(expr)).toBe(12);
  });

  it("should parse while expression", () => {
    const code =
      "(begin (var counter 0) (var result 0) (while (< counter 10) (begin (set result (+ result 1)) (set counter (+ counter 1)))) result)";
    const expr = evaParser.parse(code);
    expect(eva.eval(expr)).toBe(10);
  });
});

describe("Implement Function", () => {
  it("should can use built-in functions", () => {
    eva.eval(["print", '"hello world"']);
  });

  it("should can use user-defined functions of body for expression", () => {
    const code = parser(`(begin 
    (fn square (x) (* x x))
    (square 2)
      )`);

    expect(eva.eval(code)).toBe(4);
  });

  it("should can use user-defined functions of body for new block scope", () => {
    const code = parser(`(begin 
    (fn calc (x y) 
      (begin
        (var z 30)
        (+ (* x y) z)
      )
    )
    (calc 10 20)
      )`);

    expect(eva.eval(code)).toBe(230);
  });

  it("should can use user-defined functions of body for closure", () => {
    const code = parser(`
      (begin 
        (var value 100)
        (fn calc (x y) 
          (begin
            (var z (+ x y))

            (fn inner (foo)
              (+ (+ foo z) value))

              inner
            ))

        (var def (calc 10 20))

        (def 30)
      )`);

    // console.log(code);

    expect(eva.eval(code)).toEqual(160);
  });

  it("should can use lambda function", () => {
    const code = parser(`
      (begin 
        
        (fn onClick (callback) 
            (begin
              (var x 10)
              (var y 20)
              (callback (+ x y))
            )
        )

        (onClick (lambda (data) (* data 10)))
      )`);

    expect(eva.eval(code)).toBe(300);
  });

  it("should can use IILE function", () => {
    const code = parser(`((lambda (x y) (* x y)) 10 20)`);

    expect(eva.eval(code)).toBe(200);
  });

  it("should save variables in IILE function", () => {
    const code = parser(`(
        begin
          (var def (lambda (x y) (* x y)))

          (def 10 20)
      )`);

    expect(eva.eval(code)).toBe(200);
  });

  it("should can use recursive function", () => {
    const code = parser(`(
        begin
          (fn factorial (n)
            (if (= n 1) 
              1
              (* n (factorial (- n 1)))
            )
          )

          (factorial 5)
      )`);

    expect(eva.eval(code)).toBe(120);
  });
});

describe("Implement syntax sugar", () => {
  it("should can use --", () => {
    const code = parser(`(
        begin
          (var x 10)

          (-- x)
      )`);

    expect(eva.eval(code)).toBe(9);
  });

  it("should can use ++", () => {
    const code = parser(`(
        begin
          (var x 10)

          (++ x)
      )`);

    expect(eva.eval(code)).toBe(11);
  });

  it("should can use +=", () => {
    const code = parser(`(
        begin
          (var x 10)
          (var y 20)
          (+= x y)
      )`);

    expect(eva.eval(code)).toBe(30);
  });

  it("should can use -=", () => {
    const code = parser(`(
        begin
          (var x 10)
          (var y 20)
          (-= x y)
      )`);

    expect(eva.eval(code)).toBe(-10);
  });

  it("should can use switch condition", () => {
    const code = parser(`(
        begin
          (var x 10)

          (switch ((= x 10) 100)
                  ((> x 20) 200)
                  (else 300))
      )`);

    expect(eva.eval(code)).toBe(100);
  });

  it("should can use for loop", () => {
    const code = parser(`(
        for (var i 0) (< i 10) (++ i) (print i)
      )`);

    /**
     * `(
     *
     * (for (var i 0) (< i 10) (++ i) (print i))
     *
     * )`
     *
     * why this not ok? becase: it to expr = [[for, init, cond, update, body]], it expr[0] is Array
     * 2026-08-29
     */

    expect(eva.eval(code)).toBe(10);
  });
});

describe("Implement OOP", () => {
  it("should can use class", () => {
    const code = parser(`(begin
        (class Point null
          (begin
             (fn constructor (this x y)
              (begin
                (set (prop this x) x)
                (set (prop this y) y)
              )
            )

            (fn calc (this)
              (+ (prop this x) (prop this y))
            )
          )
         
        )

        (var p (new Point 10 20))
        ((prop p calc) p)
      )`);

    expect(eva.eval(code)).toBe(30);
  });

  it("should can use prototype", () => {
    const code = parser(`(begin
         (class Point null
          (begin
             (fn constructor (this x y)
              (begin
                (set (prop this x) x)
                (set (prop this y) y)
              )
            )

            (fn calc (this)
              (+ (prop this x) (prop this y))
            )
          )
         
        )

        (class Point3D Point
          (begin
             (fn constructor (this x y z)
              (begin
                ((prop (super Point3D) constructor) this x y)
                (set (prop this z) z)
              )
            )

            (fn calc (this)
              (+ ((prop (super Point3D) calc) this) (prop this z))
            )
          )
         
        )

        (var p (new Point3D 10 20 30))
        ((prop p calc) p)
      )`);

    /**
     * why this not ok?
     * Friist check test error information, find "if (expr[0] === "set")" condition, console.log(), postion:
     * const instanceEnv = this.eval(instance, env); instanceEnv is not env? why, I print after env
     *
     *  Environment {
          record: {
            this: 10,
            x: 20,
            y: undefined
          },
          parent: ....
     * 2026-08-31
     */

    expect(eva.eval(code)).toBe(60);
  });
});

describe("Impement module", () => {
  it("should can define modele", () => {
    const code = parser(`(begin
        (module math (begin
          (fn abs (value) (if (< value 0) (- value) value))
          
          (fn square (value) (* value value))

          (var MAX_VALUE 1000)
        ))

        ((prop math abs) 10)
      )`);

    expect(eva.eval(code)).toBe(10);
  });

  it("should can import modele", () => {
    const code = parser(`(begin
        (import Math)

        ((prop Math abs) (- 10))
      )`);

    expect(eva.eval(code)).toBe(10);
  });
});

describe("Implement Structure", () => {
  it("should use keywork for structure", () => {
    const code = parser(`(begin
        (struct Cat (begin
          (fn constructor (this name age)
            (begin
              (set (prop this name) name)
              (set (prop this age) age)
            )
          )
        ))

        (var cat (new Cat "Tom" 2))
        (prop cat name)
      )`);

    expect(eva.eval(code)).toBe("Tom");
  });
});
