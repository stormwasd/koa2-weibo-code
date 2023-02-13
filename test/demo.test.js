/**
 * @description test demo
 * @author JackLiLi
 * @param a
 * @param b
 * @returns {*}
 */

function sum(a, b) {
    return a + b
}

test('test demo 1', () => {
    const res = sum(10, 20)
    expect(res).not.toBe(40)
})