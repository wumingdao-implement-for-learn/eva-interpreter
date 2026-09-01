import { describe, it, expect } from "vitest";

import { EvaTc } from "../src/EvaTc";
import { Type } from "../src/Type";

const evaTc = new EvaTc();

describe("Implement Self-Exaluating Typecheck", () => {
  it("should typecheck number", () => {
    expect(evaTc.tc(10)).toBe(Type.number);
  });

  it("should typecheck string", () => {
    expect(evaTc.tc("string")).toBe(Type.string);
  });
});
