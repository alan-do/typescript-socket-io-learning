
//define exactly type of variable.
// bar? , bar: number , bar : number[], bar: any
function firstCompile(bar:string) {
  return "Hello, " + bar;
}

let baz = "ABC";

console.log(firstCompile(baz));
