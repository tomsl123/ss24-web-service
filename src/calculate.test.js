import {factorial} from './calculate';
import {test, describe, expect} from "@jest/globals"; // this is optional, all three are global variables im runner scope

test ('5! is 120', () => {
    expect(factorial(5)).toBe(120)
});
