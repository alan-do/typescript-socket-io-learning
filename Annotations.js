//define exactly type of variable.
// bar? , bar: number , bar : number[], bar: any
function firstCompile(bar) {
    return "Hello, " + bar;
}
var baz = "ABC";
console.log(firstCompile(baz));
