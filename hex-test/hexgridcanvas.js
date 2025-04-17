
function printCoords(coords){
	console.log("Coords: "+coords[0]+","+coords[1])
}

/*

<canvas id="myCanvas" width="1000" height="1000" style="border:1px solid black;">
</canvas>

*/

class HexGrid{
    constructor(cols, rows, size, hexArray=[]){
        this.cols=cols
        this.rows=rows
        this.size=size
        this.scale=size
        this.hexes=[]
        this.edges=[]
        //this.hexShape=new Hexagon(size)
        this.hexShape={
            factSmall : 0.8660254037844390,
            factLarge : 1.1547005383792500,
            a : size,
            b : size*0.8660254037844390,
            dx : size*1.5,
            dy : size*0.8660254037844390*2,
            points: [[-0.5,-1],[0.5,-1],[1,0],[0.5,1],[-0.5,1],[-1,0]],
        }

        this.baseHex=[]
        for (let i=0;i<6;i++){
            this.baseHex.push([this.hexShape.points[i][0]*this.hexShape.a,this.hexShape.points[i][1]*this.hexShape.b])
        }

        this.cwidth=cols*this.hexShape.a*1.5+this.hexShape.a/2+1
        this.cheight=(rows*2+1)*this.hexShape.b+1
        console.log("Dimensions: "+this.cwidth+","+this.cheight)
        
        this.layers = {}
        this.loadLayers()
        this.wpns={
            pistol:[
                {name: "Pistol", r:4,fill:"black",stroke:"grey",acc:.8,pellets:1,shots:1,rof:1},
                {name: "Heavy Pistol", r:6,fill:"black",stroke:"grey",acc:.8,pellets:1,shots:1,rof:1},
            ],
            smg:[
                {name: "SMG (Short Burst)", r:4,fill:"black",stroke:"grey",acc:.5, pellets:1,shots:15,rof:30},
                {name: "SMG (Long Burst)", r:4,fill:"black",stroke:"grey",acc:.4, pellets:1,shots:30,rof:30},
            ],

            shotgun:[
                {name: "Shotgun (Pump)", r:3,fill:"black",stroke:"grey",acc:.3, pellets:12,shots:1,rof:1},
                {name: "Shotgun (Double-Barrel)", r:3,fill:"black",stroke:"grey",acc:.1, pellets:24,shots:1,rof:1},
                {name: "Shotgun (Auto)", r:3,fill:"black",stroke:"grey",acc:.3, pellets:8,shots:5,rof:5},
            ],
            rifle:[
                {name: "Rifle", r:6,fill:"black",stroke:"grey",acc:.9,pellets:1,shots:1,rof:1},
                {name: "Sniper Rifle", r:12,fill:"black",stroke:"grey",acc:1,pellets:1,shots:1,rof:1},
            ]
        }
        //document.getElementById("layers").appendChild(this.baseSVG);
        for (let i=0;i<cols;i++){
            this.hexes.push([])
            for (let j=0;j<rows;j++){
                let myNode=new HexNode(i, j, size)
                this.hexes[i].push(myNode)
                this.drawHex(myNode)
                this.createButton(myNode)
        }}
        
        var myTest = GetSVG.circle(...this.getNode(4,4).oxy, this.hexShape.b*.5, "black")
        myTest.id="turret"
        myTest.classList.add("turret")
        this.selWpnGroup="pistol"
        this.selWpnIndex=0
        //myTest.addEventListener("click",this.bulletStorm)
        this.layers.interact.appendChild(myTest)
        this.turret = this.getNode(4,4)
    }
    getSelectedWpn(){
        return this.wpns[this.selWpnGroup][this.selWpnIndex]
    }
    setSelectedWpn(group){

    }
    selectWpn(group){
        let currGroup = this.selWpnGroup
        let currIndex = this.selWpnIndex
        if(group==this.selWpnGroup){
            if(this.selWpnIndex + 1 < this.wpns[group].length){
                this.selWpnIndex++
            } else {
                this.selWpnIndex=0;
            }
        } else {
            this.selWpnGroup = group
            this.selWpnIndex = 0
        }
        this.wpns
        console.log("selected weapon: "+this.wpns[this.selWpnGroup][this.selWpnIndex].name)

        getWpnBtn(currGroup).classList.remove('circ-de-select')
        getWpnBtn(group).classList.add('circ-de-select')
        this.setSelectedWpn(group)
    }
    loadLayers(){
        this.layers.baseHexesCanvas=document.getElementById("layer-base-hexes")
        //this.layer-base-hexes = document.createElement("canvas")
        //document.getElementById("layers").appendChild(this.layer-base-hexes)
        //this.layer-base-hexes.id="layer-base-hexes"
        this.layers.baseHexesCanvas.width=this.cwidth;
        this.layers.baseHexesCanvas.height=this.cheight;
        this.layers.baseHexesCanvas.style=/*"width:"+this.cwidth+"px; height:"+this.cheight+"px; */"border: 1px solid black"
        this.layers.baseHexes=this.layers.baseHexesCanvas.getContext("2d")

        this.layers.tokens = document.getElementById("layer-tokens")
        this.layers.tokens.style.width=this.cwidth;
        this.layers.tokens.style.height=this.cheight;

        this.layers.effects = document.getElementById("layer-effects")
        this.layers.effects.setAttribute('width', this.cwidth);
        this.layers.effects.setAttribute('height', this.cheight);
        this.layers.effects.setAttribute('viewbox', '0,0,'+this.cwidth+','+this.cheight);

        this.layers.interact = document.getElementById("layer-interact");
        //this.baseSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        //this.baseSVG.setAttribute('style', 'border: 1px solid purple');
        this.layers.interact.setAttribute('width', this.cwidth);
        this.layers.interact.setAttribute('height', this.cheight);
        this.layers.interact.setAttribute('viewbox', '0,0,'+this.cwidth+','+this.cheight);
        //svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        
    }
    selectWeapon(wpn){
        //document.getElementById("panel-select-"+(Object.keys(this.wpn).indexOf(wpn)+1)).classList.add("circ")
        
        //engine.selectWpn()
        //console.log("Selecting "+this.wpn[wpn].name)
        //console.log("Number" + Object.keys(this.wpn).indexOf(wpn))
        

        //document.getElementById("panel-select-"+(Object.keys(this.wpn).indexOf(wpn)+1)).classList.add("circ-de-select")
        

    }
    getNode(col,row){
        console.log(this.hexes[col][row])
        return this.hexes[col][row]
    }
    getNodeFromCR(col,row){
        return this.hexes[col][(row*2+(col%2))]
    }
    getXY(node, size){
        return [size*(node.x*1.5-node.x),size*(node.y*2-node.y)]
    }

    drawHex(node){
        Render.polygonOutline(this.layers.baseHexes, this.baseHex, node.oxy, 1, "black")
    }
    createButton(node){
        var myTest = GetSVG.circle(...node.oxy, this.hexShape.b, "url(#gradBlackOutline)")
        myTest.classList.add("btn")
        myTest.onclick = function(){node.clickNode()}
        this.layers.interact.appendChild(myTest)
    }
}
class Effect{
    static spread(acc){
        let mySpread = (Math.random()-0.5)*(1-acc)*engine.scale
        return mySpread
    }
    
    
    
    static shoot(projectile, origin, target){
        Effect.animateBullet(origin, target, projectile, projectile.shots)
    }
//console.log(projectile)


    static testFunc01(){
console.log("test")}

static animateBullet(origin, target, bullet, shots){
    console.log("TEST")
    let x0=origin[0]
    let y0=origin[1]
    let dx=target[0]-origin[0]
    let dy=target[1]-origin[1]
    let dist = Math.sqrt((dx*dx+dy*dy))
    let travelTime = dist/2;
    for (let i=0;i<bullet.pellets;i++){
        let x1=(target[0]+Effect.spread(bullet.acc))
        let y1=(target[1]+Effect.spread(bullet.acc))
        console.log("pellet!")
        const myImpact = setTimeout(function(){Effect.impactBlast(x1, y1, 25, 200)}, travelTime);
        const myCrater = setTimeout(function(){Effect.crater(x1, y1, 5, 2000)}, travelTime);
        let myPellet=Effect.getPellet(...origin, bullet)
        let myAnim = myPellet.animate(
            [
                {
                // from
                cx: x0+"px",
                cy: y0+"px",
                },
                {
                // to
                cx: x1+"px",
                cy: y1+"px",
                },
            ],
            travelTime,
            );
            engine.layers.effects.appendChild(myPellet)
            myAnim.addEventListener("finish", function(){myPellet.remove()})//Anim.fadeElem(myDot, 2000)})
    }
    shots--;
    if(shots>0){setTimeout(function(){Effect.animateBullet(origin, target, bullet, shots)},(1000/bullet.rof))}
}

    static fadeElem(elem, time){

    }
    static crater(cx, cy, r, time){
        var myCra = document.createElementNS("http://www.w3.org/2000/svg",'circle'); //Create a path in SVG's namespace
        myCra.setAttribute("cx",cx);
        myCra.setAttribute("cy",cy);
        myCra.setAttribute("r",0);
        myCra.style.stroke = "darkgrey";
        myCra.style.strokeWidth = 1; //Set stroke colour
        myCra.style.fill = "darkgrey"
        myCra.style.strokeWidth = "1px"; //Set stroke width
        engine.layers.effects.appendChild(myCra)
        let myCraAni = myCra.animate(
            [
            {
              // from
              r: r+"px",
              opacity:1,
            },
            {
              // to
              r: (r/2)+"px",
              opacity:0,
            },
          ],
          time*(Math.random()/2+.75)
        );
        myCraAni.addEventListener("finish", function(){myCra.remove()})
    }

    static impactBlast(cx, cy, r, time){
        var myImp = document.createElementNS("http://www.w3.org/2000/svg",'circle'); //Create a path in SVG's namespace
        myImp.setAttribute("cx",cx);
        myImp.setAttribute("cy",cy);
        myImp.setAttribute("r",0);
        myImp.style.stroke = "brown";
        myImp.style.strokeWidth = 1; //Set stroke colour
        myImp.style.fill = "yellow"
        myImp.style.strokeWidth = "1px"; //Set stroke width
        engine.layers.effects.appendChild(myImp)
        let myImpAni = myImp.animate(
            [
            {
              // from
              r: 0+"px",
              opacity:.5,
              strokeWidth:1,
            },
            {
              // to
              r: r+"px",
              opacity:0,
              strokeWidth:r/2,
            },
          ],
          200
        );
        myImpAni.addEventListener("finish", function(){myImp.remove()})
    }
    static getPellet(cx, cy, p){
        var newP = document.createElementNS("http://www.w3.org/2000/svg",'circle'); //Create a path in SVG's namespace
        newP.setAttribute("cx",cx);
        newP.setAttribute("cy",cy);
        newP.setAttribute("r",p.r);
        newP.style.stroke = p.stroke; //Set stroke colour
        newP.style.strokeWidth = 1; //Set stroke colour
        newP.style.fill = p.fill; //Set stroke colour
        newP.style.strokeWidth = "1px"; //Set stroke width
      //  myText.style="width:20px;height:20px;background-color:lightblue;top:0px;left:0px"
        return newP
    }

        static getBullet(cx, cy){
            var newElement = document.createElementNS("http://www.w3.org/2000/svg",'circle'); //Create a path in SVG's namespace
            newElement.setAttribute("cx",cx);
            newElement.setAttribute("cy",cy);
            newElement.setAttribute("r",4);
            newElement.style.stroke = "black"; //Set stroke colour
            newElement.style.strokeWidth = 1; //Set stroke colour
            newElement.style.fill = "darkgrey"; //Set stroke colour
            newElement.style.strokeWidth = "1px"; //Set stroke width
          //  myText.style="width:20px;height:20px;background-color:lightblue;top:0px;left:0px"
            return newElement
          }
}
class HexNode{
    constructor(col, row, scale){
        this.a=scale
        this.b=scale*0.8660254037844390;
        this.col=col;
        this.row=row;
        this.x=col;
        this.y=(row*2+(col%2));
        this.ox=(1.5*this.x+1)*this.a
        this.oy=(this.y+1)*this.b
        this.xy=[this.x,this.y]
        this.oxy=[this.ox,this.oy]
        this.neighborCoords=[[0,-2],[1,1],[1,-1],[0,2],[-1,-1],[-1,1]]
        this.neighbors = []
        
        //this.testMe()

    }
    testMe(){console.log(this.xy)}
    setupNeighbors(){
        for (let n=0;n<6;n++){
            let myNBx=this.x+this.neighborCoords[n][0]
            let myNBy=this.y+this.neighborCoords[n][1]
            //console.log("("+myNBx+","+myNBy+")")
            if(this.checkNeighbor(myNBx, myNBy)){this.neighbors.push([myNBx, myNBy])}
        }
        console.log(this.neighbors)
    }
    checkNeighbor(c, r){
        let rY=(r-(c%2))/2
        //console.log("checking "+c+","+rY)
        //console.log("columns: "+engine.hexes.length+", rows: "+engine.hexes[c].length)

        if(c<0 || c>(engine.hexes.length-1)){
            console.log("Colunm out of Bounds! ("+c+","+rY+")")
            return false
        } else if (rY < 0 ||rY > (engine.hexes[c].length-1)){
            console.log("Row out of Bounds! ("+c+","+rY+")")
            return false
        } else {
            return true
        }
        console.log("nope")
    }
    clickNode(){

        //TestClass.testFunc()
        //let myLine = GetSVG.lineGraph(engine.turret.oxy, this.oxy)
        //myLine.classList.add("linePath")
        //myLine.classList.add("linePath")
        //engine.layers.interact.appendChild(myLine)
        //console.log(engine.hexes)
        //engine.drawHex(this)
        //console.log(engine.hexes)

        Effect.shoot(engine.getSelectedWpn(), engine.getNode(0,0).oxy, this.oxy)
//        console.log("Neighbors of "+this.x+","+this.y+":")
        //this.setupNeighbors()
        //Effect.shot(0,0,400,400,1,200)//console.log(input)
    }
}
class TestClass{
    static testFunc(){
        console.log("TESTFUNC")
    }
}
class Anim{
    static bullet(elem, from, to, time){
        var myAnim = elem.animate(
            [
              // keyframes
              { transform: "translateY("+""+"px)" },
              { transform: "translateY("+""+"300px)" },
            ],
            {
              // timing options
              duration: 1000,
              //iterations: Infinity,
            },
          );
          myAnim.addEventListener("finish", function(){myTest.remove();console.log("done")});
    }
}

//class Render - static method(s): polygonOutline
class Render{
    static polygonOutline(ctx, baseShape, offset=[0,0], scale=1, color="black"){
        var shape=[]
            baseShape.forEach(function(item){
            shape.push([item[0]*scale+offset[0],item[1]*scale+offset[1]]);
        })
        const endPoint = shape.length-1;
        ctx.beginPath()
        ctx.moveTo(...shape[endPoint])
        shape.forEach(function(nextPoint){
            ctx.lineTo(...nextPoint);
        });
        ctx.stroke()
    }
}
//class GetSVG - static method(s): circle, lineGraph, animation
class GetSVG{
    static circle(x, y, r, fill="black", stroke="none"){
        //console.log(x+","+y+","+r)
        var myCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        myCircle.setAttribute("cx", x)
        myCircle.setAttribute("cy", y)
        myCircle.setAttribute("r", r)
        myCircle.setAttribute("fill", fill)
        return myCircle
    }
    static lineGraph(from, to){
        var myPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        let x = from[0]
        let y = from[1]
        let dx = to[0]-x
        let dy = to[1]-y
        myPath.setAttribute("d", "M"+x+" "+y+" L"+to[0]+" "+to[1])
        myPath.setAttribute("stroke","black")
        myPath.setAttribute("stroke-width", "2")
        console.log(myPath)
        return myPath
        
    }
    static animation(x0, y0, x1, y1, time){
        var myAnim = document.createElementNS("http://www.w3.org/2000/svg", 'animate');
        myAnim.setAttribute("attributeName", "cx")
        myAnim.setAttribute("begin", "0s")
        myAnim.setAttribute("dur", time+"s")
        myAnim.setAttribute("from", x0)
        myAnim.setAttribute("to", x1)
        myAnim.setAttribute("fill", "freeze")
        return myAnim
    }
}

function getWpnBtn(wpn){
    console.log("panel-select-"+(Object.keys(engine.wpns).indexOf(wpn)+1))
    return document.getElementById("panel-select-"+(Object.keys(engine.wpns).indexOf(wpn)+1))
}

function selectWeapon(num){
let weapons = Object.keys(engine.wpns)
if(num-1 < weapons.length){
    engine.selectWpn(weapons[num-1])
    document.getElementById("wpn-txt").textContent=engine.getSelectedWpn().name
}

/*let myWpn = Object.keys(engine.wpn)[num-1]
console.log("Selecting..."+Object.keys(engine.wpn)[num-1])
if(num<weapons.length){
getWpnBtn(engine.selectedWpn).classList.add("circ")
getWpnBtn(engine.selectedWpn).classList.remove("circ-de-select")
console.log(engine.selectedWpn=myWpn)
getWpnBtn(myWpn).classList.add("circ-de-select")
getWpnBtn(myWpn).classList.remove("circ")
//console.log(weapons)
//console.log(engine.selectedWpn)
//console.log("---")
console.log("You selected...#"+num)
console.log((engine.wpn[weapons[num-1]]).name)
}*/

}
var engine
window.onload= function(){
    //document.getElementById("main-body").addEventListener("onkeydown", (e) => {selectWeapon()})
    engine = new HexGrid(12,12,40)
    engine.selectWpn("pistol")
    console.log("test")
}



//function dr

/*5
function setHex(data){
	var myHexShape=[]
	data.hexShape.forEach(function(item){
		myHexShape.push([item[0]*data.a,item[1]*data.b])
	})
	data.hex=myHexShape
}

function drawHex(data, coords){
	var myHex=[];
	const ox=data.a+data.dx*coords[0];
	const oy=data.b+data.dy*coords[1]+data.b*(coords[0]%2);
	drawShape(offsetShape(getHex(data),[ox,oy]))
}


function getHex(data){
	var myHex=[]
	data.hexShape.forEach(function(item){
		myHex.push([item[0]*data.a,item[1]*data.b])
	})
	return myHex
}

*/

/*
const myScale=new scaleData()
setHex(myScale)
console.log("HEx:")
console.log(myScale.hex)
//drawHex(offsetHex(myScale.hex,[0,0]))

//drawShape(offsetShape(hShape,[a,b]))

//drawHex(myData,[0,0])

//console.log(getHex(myScale))

for(var i=0;i<10;i++){for(var j=0;j<10;j++){
drawHex(myScale,[i,j])}}

//console.log(myScale.hexpts)


//Midpoint= a,b
//const hShape = [[ha*0.5,0],[stepx,0],[ha*2,hb],[stepx,hb*2],[ha*0.5,hb*2],[0,hb]];	



ctx.fillStyle = "lightblue";
//repeatShape(hxC, [10,8], [dx,dy],b, [a,b])
*/
