export const name = "testStr";

export function testFunc(arg1) {
  console.log(arg1)
  return {arg1};
}
export function getpoly(pts){
var myPoly = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
let myPtString=""
for (const pt of pts){}

let ptStr = pts.map((pt) => `${pt[0]} ${pt[1]}`).join(", ")
myPoly.setAttribute("points", myPtString)
//myPoly.setAttribute("fill", fill)
//myPoly.setAttribute("stroke", stroke)
return ptStr
}