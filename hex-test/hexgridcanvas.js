
function printCoords(coords){
	console.log("Coords: "+coords[0]+","+coords[1])
}

/*

<canvas id="myCanvas" width="1000" height="1000" style="border:1px solid black;">
</canvas>

*/
class Hexagon{
    constructor(){
    }
    static nbCoords(){}
    static pointCoords(){
        return [[-0.5,-1],[0.5,-1],[1,0],[0.5,1],[-0.5,1],[-1,0]]
    }
    static edgeCoords(){
        let myPoints = Hexagon.pointCoords()
        let myEdges=[]
        for (let i=0;i<6;i++){
            let newX= (myPoints[i][0]+myPoints[(i+1)%6][0])/2
            let newY= (myPoints[i][0]+myPoints[(i+1)%6][0])/2
            myEdges.push([newX, newY])
        }
    }
    static abRatio(){}
    static getPoints(){}
    static getNeighbors(){}
    static getEdges(){}
}
class HexGrid{
    constructor(cols, rows, size, hexArray=[]){
        this.cols=cols
        this.rows=rows
        this.size=size
        this.scale=size
        this.hexes=[]
        this.edges=[]

        this.constructDimensions()       
        this.constructLayers()
        this.constructWeapons()
        this.constructHexes()

        var myTest = GetSVG.circle(...this.getNode(4,4).oxy, this.hexShape.b*.5, "black")
        myTest.id="turret"
        myTest.classList.add("turret")
        this.selWpnGroup="pistol"
        this.selWpnIndex=0
        this.turret = this.getNode(4,4)
      
    }

    
    constructDimensions(){
        this.hexShape={
            factSmall : 0.8660254037844390,
            factLarge : 1.1547005383792500,
            a : this.size,
            b : this.size*0.8660254037844390,
            dx : this.size*1.5,
            dy : this.size*0.8660254037844390*2,
            points: [[-0.5,-1],[0.5,-1],[1,0],[0.5,1],[-0.5,1],[-1,0]],
        }
        this.baseHex=[]
        for (let i=0;i<6;i++){
            this.baseHex.push([this.hexShape.points[i][0]*this.hexShape.a,this.hexShape.points[i][1]*this.hexShape.b])
        }
        this.cwidth=this.cols*this.hexShape.a*1.5+this.hexShape.a/2+1
        this.cheight=(this.rows*2+1)*this.hexShape.b+1
    }
    constructLayers(){
        this.layers = {}
        this.layers.baseHexesCanvas=document.getElementById("layer-base-hexes")
        //this.layer-base-hexes = document.createElement("canvas")
        //document.getElementById("layers").appendChild(this.layer-base-hexes)
        //this.layer-base-hexes.id="layer-base-hexes"
        this.layers.baseHexesCanvas.width=this.cwidth;
        this.layers.baseHexesCanvas.height=this.cheight;
        this.layers.baseHexesCanvas.style=/*"width:"+this.cwidth+"px; height:"+this.cheight+"px; */"border: 1px solid black"
        this.layers.baseHexes=this.layers.baseHexesCanvas.getContext("2d")

        
        this.layers.tokens = document.getElementById("layer-tokens")
        this.layers.tokens.style.width=this.cwidth + "px";
        this.layers.tokens.style.height=this.cheight + "px";

        this.layers.effects = document.getElementById("layer-effects")
        this.layers.effects.setAttribute('width', this.cwidth);
        this.layers.effects.setAttribute('height', this.cheight);
        this.layers.effects.setAttribute('viewbox', '0,0,'+this.cwidth+','+this.cheight);

        
        this.layers.overHex = document.getElementById("layer-hex-super");
        //this.baseSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        //this.baseSVG.setAttribute('style', 'border: 1px solid purple');
        this.layers.overHex.setAttribute('width', this.cwidth);
        this.layers.overHex.setAttribute('height', this.cheight);
        this.layers.overHex.setAttribute('viewbox', '0,0,'+this.cwidth+','+this.cheight);

        this.layers.interact = document.getElementById("layer-interact");
        //this.baseSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        //this.baseSVG.setAttribute('style', 'border: 1px solid purple');
        this.layers.interact.setAttribute('width', this.cwidth);
        this.layers.interact.setAttribute('height', this.cheight);
        this.layers.interact.setAttribute('viewbox', '0,0,'+this.cwidth+','+this.cheight);
        //svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this.effects={pending:false,queue:[]}
        this.tokens={animating:false,tokens:[]}
    }
    constructWeapons(){
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
    }
    constructHexes(){
        for (let i=0;i<this.cols;i++){
            this.hexes.push([])
            for (let j=0;j<this.rows;j++){
                let myNode=new HexNode(i, j, this.scale, this.baseHex)
                myNode.terrain="hex"
                this.hexes[i].push(myNode)
                this.drawHex(myNode)
                this.createButton(myNode)
                this.createSlices(myNode)
        }}
        for (let i=0;i<this.cols;i++){
            for (let j=0;j<this.rows;j++){
                this.getNode(i,j).setupNeighbors(this.hexes)
                for(let n=0; n<6;n++){

                }
        }}    
    }
    
    qAnimation(){

    }
    animateGuy(tok){
        //<img id="myGuyAnim" style="width:90px; height: 90px;" src=".\asset\guy\rifle\idle\survivor-idle_rifle_0.png"/>

        let myGuy = document.getElementById("myGuyAnim")
        myGuy.src=tok.getFrame()
        let myGuyFeet = document.getElementById("myGuyAnimFeet")
        myGuyFeet.src=tok.getFeetFrame()
        
        
    }
    animateTokens(){
        engine.animateGuy(tokens[0])
        /*if(this.effects.pending){
            for(let i=0;i<this.effects.queue.length;i++){
                //resolve effect
            }
            //redraw canvas
        }
        if(this.tokens.animating){
            for(let i=0;i<this.tokens.all.length;i++){
                if(this.tokens.all[i].active=true){}
            }
        }
        animCounter++
        //console.log(animCounter)*/
        requestAnimationFrame(engine.animateTokens)
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
    selectWeapon(wpn){
        //document.getElementById("panel-select-"+(Object.keys(this.wpn).indexOf(wpn)+1)).classList.add("circ")
        
        //engine.selectWpn()
        //console.log("Selecting "+this.wpn[wpn].name)
        //console.log("Number" + Object.keys(this.wpn).indexOf(wpn))
        

        //document.getElementById("panel-select-"+(Object.keys(this.wpn).indexOf(wpn)+1)).classList.add("circ-de-select")
        

    }

    getGuyFrame(guy, wpn, pose, current){

    }
    getNode(col,row){
        //console.log(this.hexes[col][row])
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
    drawHexTriangles(node){
        
        Render.polygonOutline(this.layers.baseHexes, this.baseHex, node.oxy, 1, "black")
    }
    createButton(node){
        var myTest = GetSVG.circle(...node.oxy, this.hexShape.b, "none")
        myTest.id="circle-"+node.col+"-"+node.row
        myTest.classList.add("btn")
        this.layers.interact.appendChild(myTest)
    }
    createSlices(node){
        let myDirs = ["n", "ne", "se", "s", "sw", "nw"]
        for (let i=0;i<6;i++){
            let myDir=myDirs[i]
            console.log("---------SLICING------------")
            console.log(node.makeSlice(myDir))
            let mySlice=GetSVG.poly(node.makeSlice(myDir), "#FFFFFF00", "none")
            let myEdge=GetSVG.edge(...node.edges[i], "#FF000000", "#FFFF00FF")
            myEdge.setAttribute("stroke-width", "4")
            console.log(node.edges[i])
            mySlice.id="slice-"+node.col+"-"+node.row+"-"+myDir
            myEdge.id="edge-"+node.col+"-"+node.row+"-"+myDir
            mySlice.onclick = function(){node.clickNode(myDir)}
            mySlice.onmouseover = function(){node.enterNode(myDir)}
            mySlice.onmouseleave = function(){node.leaveNode(myDir)}
            this.layers.interact.appendChild(mySlice)
            this.layers.interact.appendChild(myEdge)
        }
            
        //this.layers.interact.appendChild(myTest)  
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


    static testFunc01(){
        console.log("test")
    }

    static animateBullet(origin, target, bullet, shots){
        let x0=origin[0]
        let y0=origin[1]
        let dx=target[0]-origin[0]
        let dy=target[1]-origin[1]
        let dist = Math.sqrt((dx*dx+dy*dy))
        let travelTime = dist/2;
        for (let i=0;i<bullet.pellets;i++){
            let x1=(target[0]+Effect.spread(bullet.acc))
            let y1=(target[1]+Effect.spread(bullet.acc))
            //console.log("pellet!")
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
    constructor(col, row, scale, points){
        this.points=points
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
        this.dir = {"n": 0, "ne": 1, "se":2, "s":3, "sw":4, "nw": 5}
        this.dirNum=["n","ne","se","s", "sw", "nw"]
        this.neighbors = {}
        this.edges = []
        //this.testMe()
        this.corners  = []
        console.log("---------EDGES--------------")
        console.log(this.edges)
        for(let i=0;i<6;i++){
            let firstX=this.points[i][0]+this.ox
            let firstY=this.points[i][1]+this.oy
            let secondX=this.points[(i+1)%6][0]+this.ox
            let secondY=this.points[(i+1)%6][1]+this.oy
            console.log(firstX+", "+firstY+" to "+secondX+", "+secondY)
            this.edges.push(
                [[firstX, firstY], [secondX, secondY]]
            )

            console.log(this.edges[i])

        }
        console.log("---------EDGES--------------")
        console.log(this.edges)
    }

    
    makeSlice(myDir){
        let myEdges= this.edges[this.dir[myDir]]
        let mySlice = []
        mySlice.push(myEdges[0])
        mySlice.push(myEdges[1])
        mySlice.push(this.oxy)
        return mySlice
    }
    testMe(){console.log(this.xy)}

    clickNode(dir){
        console.log(dir)
        //TestClass.testFunc()
        //let myLine = GetSVG.lineGraph(engine.turret.oxy, this.oxy)
        //myLine.classList.add("linePath")
        //myLine.classList.add("linePath")
        //engine.layers.interact.appendChild(myLine)
        //console.log(engine.hexes)
        //engine.drawHex(this)
        //console.log(engine.hexes)
        //this.getSlice("n")
        //engine.layers.interact.appendChild(GetSVG.poly(this.getSlice("n"), "red", "blue"))
        Effect.shoot(engine.getSelectedWpn(), engine.turret.oxy, this.oxy)
        console.log(this.neighbors[dir][0]+" ("+this.neighbors[dir][1]+")")
//        console.log("Neighbors of "+this.x+","+this.y+":")
        //this.setupNeighbors()
        //Effect.shot(0,0,400,400,1,200)//console.log(input)
    }
    getTri(dir){
        return document.getElementById("slice-"+this.col+"-"+this.row+"-"+dir)
    }
    getCirc(){
        return document.getElementById("circle-"+this.col+"-"+this.row)
    }
    getEdge(dir){
        return document.getElementById("edge-"+this.col+"-"+this.row+"-"+dir)
    }
    enterNode(dir){
        //console.log(this.xy+"("+dir+")")
        //this.getCirc().appendChild(GetSVG.radGrad(this.ox, this.oy, this.ox, this.oy, this.a, "red", "blue"))
        this.getEdge(dir).setAttribute("stroke", "#FF0000FF")
        this.getEdge(dir).setAttribute("stroke-width", "4")
        //this.getTri(dir).setAttribute("fill", "red")
        this.getCirc(dir).setAttribute("fill", "#FF00007F")
    }
    leaveNode(dir){
        //console.log(this.xy+"("+dir+")")
        this.getEdge(dir).setAttribute("stroke", "#FFFFFF00")
        //this.getTri(dir).setAttribute("fill", "#FFFFFF00")
        this.getCirc(dir).setAttribute("fill", "#FFFFFF00")
    }

    setupNeighbors(hxs){
        for (let n=0;n<6;n++){
            //console.log("("+myNBx+","+myNBy+")")
            let myNBx=this.x+this.neighborCoords[n][0]
            let myNBy=this.y+this.neighborCoords[n][1]
            if(this.checkNeighbor(myNBx, myNBy, hxs)){
                this.neighbors[this.dirNum[n]]=["hex", [myNBx, myNBy]]
            } else {
                this.neighbors[this.dirNum[n]]=["wall", [myNBx, myNBy]]
            }
        }
    }
    checkNeighbor(c, r, hxs){
        let rY=(r-(c%2))/2
        //console.log("checking "+c+","+rY)
        //console.log("columns: "+engine.hexes.length+", rows: "+engine.hexes[c].length)

        if(c<0 || c>(hxs.length-1)){
            //console.log("Colunm out of Bounds! ("+c+","+rY+")")
            return false
        } else if (rY < 0 ||rY > (hxs[c].length-1)){
            //console.log("Row out of Bounds! ("+c+","+rY+")")
            return false
        } else {
            return true
        }
        console.log("nope")
    }
}
class TestClass{
    static testFunc(){
        console.log("TESTFUNC")
    }
}
/*class Anim{
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
}*/

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
        ctx.strokeStyle=color
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
        myCircle.setAttribute("stroke", stroke)
        return myCircle
    }
    static poly(points, fill="black", stroke="none"){
        var myPoly = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
        let myPtString=""
        for (let i=0;i<points.length; i++){
            myPtString += points[i][0]+","+points[i][1]+" "
        }
        //console.log("creating points ="+myPtString)
        myPoly.setAttribute("points", myPtString)
        myPoly.setAttribute("fill", fill)
        myPoly.setAttribute("stroke", stroke)
        return myPoly
    }
    static edge(pA, pB, stroke="none", width=1){
        var myEdge = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        myEdge.setAttribute("d", "M"+pA[0]+" "+pA[1]+" L"+pB[0]+" "+pB[1])
        myEdge.setAttribute("stroke",stroke)
        myEdge.setAttribute("stroke-width", width)
        //console.log("creating points ="+myPtString)

        return myEdge
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
    static radGrad(cx, cy, fx, fy, r, col1, col2){
        var myGrad = document.createElementNS("http://www.w3.org/2000/svg", 'radialGradiant')
        myGrad.setAttribute("cx", cx)
        myGrad.setAttribute("cy", cy)
        myGrad.setAttribute("fx", fx)
        myGrad.setAttribute("fy", fy)
        myGrad.setAttribute(r, r)
        let myStop1 = document.createElementNS("http://www.w3.org/2000/svg", 'stop')
        let myStop2 = document.createElementNS("http://www.w3.org/2000/svg", 'stop')
        myStop1.setAttribute("offset", "20%")
        myStop1.setAttribute("stop-color", "red")
        myStop2.setAttribute("offset", "80%")
        myStop2.setAttribute("stop-color", "blue")
        myGrad.appendChild(myStop1)
        myGrad.appendChild(myStop2)
        return myGrad

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



}
// path= .\asset\guy\[WEAPON]\[ACTION]\

let animCounter = 0
let tokenNames={
    guy:{
        rifle: {

            idle:{frames:20, src:"rifle\idle\survivor-idle_rifle_"},
            meleeattack:{frames:15, src:"rifle\idle\survivor-meleeattack_rifle_"},
            move:{frames:20, src:"rifle\idle\survivor-idle_rifle_"},
            reload:{frames:20, src:"rifle\idle\survivor-idle_rifle_"},
            shoot:{frames:20, src:"rifle\idle\survivor-idle_rifle_"},
        }
    }
    


}
class Token{
    constructor(path, name, animations){
        this.path=path
        this.name=name
        this.animations=animations
        this.currentState="rifle"
        this.currentAnim="move"
        this.currentFrame=0
        this.maxFrames=this.animations[this.currentState][this.currentAnim]
        this.switch=false
        this.next="move"
        this.defaultAnim="move"
        this.speedFactor=4
        this.subFrame=0
    }
    getImage(path, name, anim, state, frame){
        return path+name+"-"+anim+"_"+state+"_"+frame
    }
    advanceFrame(){

        this.subFrame = (this.subFrame+1)%this.speedFactor

        if(this.subFrame==0){
            return true
        } else {
            return false
        }
        
    }
    
    getFrame(){
        if(this.switch){
            this.currentAnim=this.next
            this.maxFrames=this.animations[this.currentState][this.currentAnim]
            this.switch=false
            this.next=""
            this.currentFrame=0
            return this.getImage(this.path, this.name, this.currentAnim, this.currentState, 0)
            //return this.name+"-"+this.currentAnim+"_"+this.currentState+"_0"
        } else {
            //cycle frame
            //console.log(this.getImage(this.path, this.name, this.currentAnim, this.currentState, this.currentFrame))
            //console.log(this.currentFrame+1)
            let myFramePath=this.getImage(this.path, this.name, this.currentAnim, this.currentState, this.currentFrame+".png")

            if(this.advanceFrame()){

                this.currentFrame=(this.currentFrame+1)%this.maxFrames
            } else {

            }
            return myFramePath
        }
    }
    getFeetFrame(){
        let mode=this.animations.feet[this.currentAnim]
        console.log(mode)
        if(mode=="idle"){
            return "./asset/survivor/survivor-idle_0.png"
        } else {
            return "./asset/survivor/survivor-run_"+this.currentFrame+".png"
        }
    }
    getNextImg(){
        return this.path+this.currentState+"/"+this.name+"-"+this.currentAnim+".png"
    }
}

let survivorAnimations={
    rifle:{idle:20,meleeattack:15,move:20,reload:20, shoot:3},
    shotgun:{idle:20,meleeattack:15,move:20,reload:20, shoot:3},
    handgun:{idle:20,meleeattack:15,move:20,reload:15, shoot:3},
    knife:{idle:20,meleeattack:15,move:20},
    flashlight:{idle:20,meleeattack:15,move:20},
    feet:{idle:"idle",meleeattack:"idle",reload:"idle",shoot:"idle",move:"walk"}
}

//let survivor = new Token(survivorAnimations)
let tokens=[new Token("./asset/survivor/", "survivor", survivorAnimations)]


var engine

window.onload= function(){
    console.log("does this run?")
    //document.getElementById("main-body").addEventListener("onkeydown", (e) => {selectWeapon()})
    engine = new HexGrid(12,12,40)
    engine.selectWpn("pistol")
    console.log("test")
    console.log(tokens)
    //let myGuyFeet = document.getElementById("myGuyAnimFeet")
    //myGuyFeet.src="./asset/survivor/survivor-idle_0.png"
    //tokens[0].getFeetFrame()
    engine.animateTokens()
}


