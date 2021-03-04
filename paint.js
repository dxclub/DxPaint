/*The following code was grabbed from codepen.io and was written by
 *Cahil Foley in response to a video about Matrix Rain Video uploaded
 *to Youtube by "The Coding Train" channel
 *LINK TO THE VIDEO: https://www.youtube.com/watch?v=S1TQCi9axzg
 */

 class Letter {
  constructor(x, y, d) {
    this.char = Letter.getChar()
    this.x = x
    this.y = y
    this.d = d
  }

  draw(index) {
    textSize(this.d)

    if (index === 0) {
      // If it's the first one make it white
      fill(255, 200)
    } else {
      // Otherwise make it green and fade it out more when it's towards then end
      fill(50, 255, 50, 200 - (index * 200) / 25)
    }

    text(this.char, this.x * (width / total), this.y)
  }

  switch() {
    this.char = Letter.getChar()
  }

  static getChar() {
    return String.fromCharCode(floor(0x30a0 + random(0, 96)))
  }
}


class Stream {
  constructor(x, y, ys) {
    this.x = x
    this.y = y
    this.ys = ys
    this.letters = []

    // Use the y speed to figure out the diameter
    this.d = ys * 2.5
    this.spacing = this.d + 2

    this.regenerateLetters()
  }

  regenerateLetters() {
    this.letters = []
    for (let i = 0; i < 25; i++) {
      this.letters.push(new Letter(this.x, this.y - i * this.spacing, this.d))
    }
  }

  draw() {
    // Update the position
    this.update()

    // Draw each letter
    this.letters.forEach((l, i) => l.draw(i))

    // 10% chance to randomly switch a letter
    if (random(1, 100) < 10) {
      this.letters[floor(random(this.letters.length))].switch()
    }
  }

  update() {
    // Add the speed to the stream head position
    this.y += this.ys

    // If there is enough space to add a letter at the start
    if (this.y >= this.letters[0].y + this.spacing) {
      // Add a new letter at the start
      this.letters.unshift(new Letter(this.x, this.y, this.d))

      // Remove the last item
      this.letters.pop()
    }

    // If the last character has gone off the screen
    if (this.letters[this.letters.length - 1].y > height + this.d) {
      // Reset the head to the top of the screen
      this.y = 0
      
      // Regenerate letters as all x values will change
      this.regenerateLetters()
    }
  }
}

let total = 100
let rain = []

/* The following code was written by Laura C., Diego G. and Salvador G.
 * for the final meeting of our club, the Digital Transformation Club(Dx Club)
 * which takes/took place on March 3rd 2021 at 6pm PST.
 * The purpose of this code is to recreate MS Paint using the JavaScript library P5.js
 * The code located underneath this comment block is a modified version of the draw/setup
 * function that was given to us by Cahil Foley.
 */

/*
 *TODO:
 *  - color picker - Laura
 *  - possible cypher easter egg? - Diego
 *  - brush picker - Sal
 *  - shape picker - Sal
 *  - matrix rain background?
 *  - testing
 *  - documentation
 */

// GLOBAL VARIABLES

var r = 0;
var g = 0;
var b = 0;
var cx =10;
var tx =10;
var sx =10;
let slider;
var currentBrush = 'square';
var currentStroke;
var buttons = []; // Used for buttons and other interactions
var canvas;
var shapes = [];
var input;

// Variables for buttons
var bps = [20, 100, 180, 260];
var bWidth = 60;
var bHeight = 60;
var padding = 10;

var easterEggString;
var easterEggInput;
var easterEggBool;

function setup() {
  //EasterEgg setup
  //easterEggString = createP("What is the code?")
  easterEggString = createDiv("What is the code?")
  easterEggString.position(120,192);
  easterEggInput = createInput('');
  easterEggInput.position(120, 212);
  easterEggInput.changed(redPill);
 // createP('');
  
  createCanvas(window.innerWidth - 55, window.innerHeight - 195)
  bWidth = 60;
  bHeight = window.innerHeight / 20;


  console.log("Button size: " + bWidth);
  buttons.push(new Hitbox(25, bps[0], bWidth, bHeight, 'square'));
  buttons.push(new Hitbox(25, bps[1], bWidth, bHeight, 'circle'));
  buttons.push(new Hitbox(25, bps[2], bWidth, bHeight, 'pencil'));
  buttons.push(new Hitbox(25, bps[3], bWidth, bHeight, 'eraser'));

  for(var i = 0; i < buttons.length; i++){
    buttons[i].active = true; // set all hitboxes active
  }
  // vvvvvvvvvvvvvvvvvvvvvvvv

  if(easterEggBool == true){
    [3].active = true;
  }
  
  canvas = new Hitbox(120, 0, window.innerWidth - 175, window.innerHeight - 195);

  //canvas.position(50, 100);
  //canvas.position(10, 10, 'fixed')
  //noStroke()
  //textStyle(BOLD)

  //Cdde to get the matrix rain stream loaded
  //EasterEgg setup pt.2
  for (let i = 0; i < total; i++) {
    rain.push(new Stream(i, random(1, height), random(2, 10)))
  }
  slidyboi(16, 645, 1,100);
}

//Function that will start the easter Egg
function redPill(){
  //Case where the cypher is correct
  if(easterEggInput.value() === "I would like to take the red pill"){ 
    easterEggString.html("NOW EXITING THE MARTRIX!!!!");
    easterEggBool = true;
  }
  //Case where the cypher is wrong
  else{
    easterEggString.html("Nope, that is not the cypher! Try again!");
    easterEggBool = false;
  }
}

function draw() {
  //resizeCanvas(window.innerWidth, window.innerHeight)
  background(255);

  currentStroke = slider.value();

  if(mouseIsPressed && currentBrush == 'eraser' && canvas.check(mouseX, mouseY)){
    shapes.push(new Pencil(mouseX, mouseY, pmouseX, pmouseY, [255, 255, 255], (currentStroke / 2)));
  }

  if(mouseIsPressed && currentBrush == 'pencil' && canvas.check(mouseX, mouseY)){
    shapes.push(new Pencil(mouseX, mouseY, pmouseX, pmouseY, [r, g, b], (currentStroke / 2)));
  }

  for(var i = 0; i < shapes.length; i++){
    shapes[i].draw();
  }

  sidebar();
  colorPicker(10,380);

  //If the easter egg is triggered, then it's time to break out!
  if(easterEggBool == true){
    rain.forEach(s => s.draw())
  }
}

/*This function will be what represents the pallete
 * in which the user will be able to change the color
 * they're using, the paint brush, etc....
 */
function sidebar(){
  // Sidebar
  noStroke();
  fill(25); // change 25
  rect(0, 0, 120, window.innerHeight);

  // Brushes

  // Square
  stroke(100);
  fill(50);
  rect(25, bps[0], bWidth, bHeight);
  noStroke();
  fill(r, g, b);
  rect(42.5, bps[0] + 17.5, 25, 25);

  // Circle
  stroke(100);
  fill(50);
  rect(25, bps[1], bWidth, bHeight);
  noStroke();
  fill(r, g, b);
  ellipse(55, bps[1] + 30, 30);

  // Pencil
  stroke(100);
  fill(50);
  rect(25, bps[2], bWidth, bHeight);
  noStroke();
  pIcon(37, bps[2] -85);
  
  // special brush
  stroke(100);
  fill(50);
  rect(25, bps[3], bWidth, bHeight);
  noStroke();
  fill(245, 150, 200);
  rect(35.5, bps[3] + 12.5, 40, 25); // eraser icon
}

function pIcon(x,y){
    fill(230, 210, 180)
    triangle(x+1, y+95, x-13, y+105, x+1, y+115);
    fill(r, g, b);
    rect(x+1, y+95, 35, 19.5)
    fill(245, 150, 200)
    rect(x+36,y+95, 12,19.5)
  
}

function colorPicker(x,y){
    //color picker bb
    stroke(100)
    fill(50);
    rect(x, y, 100, 150);
    noStroke();
    //title of the color picker
    fill(r,g,b);
    rect(x+0.5, y+0.5, 100-1, 30);
    fill(0, 102, 153);
    textSize(18);
    fill(255);
    textAlign(CENTER);
    textStyle(BOLD);
    textFont("Comic Sans MS");
    text('Colors', x+50, y+23);
    //color sliders
    //red
    fill(200);
    rect(x, y+40, 100, 30);
    fill(255, 0, 0);
    //circle(cx, y+55, 20)
    ellipse(cx, y+55, 20);
    if(mouseX >= x && mouseX <= x+100 && mouseY >= y+40 && mouseY <= y+70){
      if(mouseIsPressed){
        cx = mouseX;
        r = (255/100) * (cx-10);
      }
    }
    //green
    fill(200);
    rect(x, y+80, 100, 30);
    fill(0, 255, 0);
    triangle(tx+1, y+85, tx-11, y+105, tx+11.5, y+105)
    if(mouseX >= x && mouseX <= x+100 && mouseY >= y+80 && mouseY <= y+110){
      if(mouseIsPressed){
        tx = mouseX;
        g = (255/100) * (tx-10);
      }
    }
    //blue
    fill(200);
    rect(x, y+120, 100, 30);
    fill(0, 0, 255);
    rect(sx -9, y+124, 19, 19);
    if(mouseX >= x && mouseX <= x+100 && mouseY >= y+120 && mouseY <= y+150){
      if(mouseIsPressed){
        sx = mouseX;
        b = (255/100) * (sx-10);
      }
    }
  }

function slidyboi(x,y,minVal,maxVal){
  slider = createSlider(minVal, maxVal, maxVal/2, 0);
  slider.position(x, y);
  slider.style('width', '80px');
}

function sizePicker(x, y){
  fill(0);
  rect(x, y, 100, 150);
  textSize(18);
  fill(255);
  textAlign(CENTER);
  textStyle(BOLD);
  textFont("Comic Sans MS");
  text("Stroke Size", x, y);

}

function mousePressed(){

  // Check if a brush button was pressed
  for(var i = 0; i < buttons.length; i++){
    if(buttons[i].check(mouseX, mouseY)){
      currentBrush = buttons[i].id;
      console.log("Current brush: " + currentBrush);
    }
  }

  if(canvas.check(mouseX, mouseY)){
    console.log("Draw to the canvas!");
    if(currentBrush == 'square'){ // Add a square to the canvas
      console.log("Square added");
      shapes.push(new Square(mouseX - (currentStroke / 2), mouseY - (currentStroke / 2), currentStroke, [r,g,b]));
    } else if(currentBrush == 'circle'){ // add a circle to the canvas
      console.log("Circle added");
      shapes.push(new Circle(mouseX, mouseY, currentStroke, [r, g, b]))
    }
  }
}

class Hitbox{
  //ox and oy are the coords for the top left corner of the thing you want the hitbox over
  constructor(ox, oy, w, h, id){
    this.x = ox; // x top corner
    this.y = oy; // y top corner
    this.w = w; // width
    this.h = h; // height
    this.id = id; // Used for identifying a hitbox
    this.active = true; // To disable a hitbox set active to false
  }

  update(){ // Use if you need to move the hitbox somewhere else during runtime
    this.x += hx;
    this.y += hy;
    fill(255, 0, 0, 100);
  }

  check(mX, mY){ //This will return true or false if mouse was clicked on top of the hitbox
    if(mX >= this.x && mX <= this.x + this.w && mY >= this.y && mY <= this.y + this.h && this.active)
      return true;
    else
      return false;
  }
}

class Square{
  constructor(ox, oy, size, color){
    this.x = ox;
    this.y = oy;
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
    this.size = size;
  }

  draw(){
    noStroke();
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.size, this.size);
  }
}

class Circle{
  constructor(ox, oy, size, color){
    this.x = ox;
    this.y = oy;
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
    this.size = size;
  }

  draw(){
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, this.size);
  }
}

class Pencil{
  constructor(x, y, px, py, color, size){
    this.x = x;
    this.y = y;
    this.px = px;
    this.py = py;
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
    this.size = size;
  }

  draw(){
    strokeWeight(this.size);
    stroke(this.r, this.g, this.b);
    line(this.x, this.y, this.px, this.py);
    strokeWeight(1);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth - 55, window.innerHeight - 195)
}