var VSHADER = "x-shader/x-vertex";
var FSHADER = "x-shader/x-fragment";
var gl;
var player;
function initGL(canvas) {
   try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
   } catch (e) {
   }
   if (!gl) {
       alert("Could not initialise WebGL, sorry :-( :=(");
   }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
    if (k.nodeType == 3) {
        str += k.textContent;
    }
    k = k.nextSibling;
    }

    console.log("Shader: "+str);

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    shaderProgram = getShaders("shader-fs", "shader-vs");

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function getShaders(fragment, vertex){
    var fragmentShader = getShader(gl, fragment);
    var vertexShader = getShader(gl, vertex);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    return program;
}


var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms(program) {
    gl.uniformMatrix4fv(program.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, mvMatrix);
}



var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;

function initBuffers() {
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;

    squareVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    vertices = [
        1.0,  1.0,  0.0,
       -1.0,  1.0,  0.0,
        1.0, -1.0,  0.0,
       -1.0, -1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    squareVertexPositionBuffer.itemSize = 3;
    squareVertexPositionBuffer.numItems = 4;
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    gl.useProgram(shaderProgram);

    mat4.translate(mvMatrix, [-1.5, 0.0, -7.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(shaderProgram);
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);


    mat4.translate(mvMatrix, [3.0, 0.0, 0.0]);
    gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, squareVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(shaderProgram);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, squareVertexPositionBuffer.numItems);
    player.update();
    player.draw();

    requestAnimFrame(drawScene);
}



window.onload = function webGLStart() {
    var canvas = document.getElementById("myCanvas");
    initGL(canvas);
    initShaders();
    initBuffers();

    player = new Player();
    player.initialize();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();
}


function Player(){
    this.program = getShaders("shader-fs2", "shader-vs");

    this.vertices = [
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0
    ];

    this.x = 0.0;
    this.vx = 0.05;
    this.y = 0.0;
    this.vy = 0.01;
    this.z = 0.0;
    this.vz = 0.1;


    this.initialize = function(){
        gl.useProgram(this.program);
        this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
        gl.enableVertexAttribArray(this.program.vertexPositionAttribute);

        this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
        this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");

        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.buffer.itemSize = 3;
        this.buffer.numItems = 3;

    }

    this.draw = function(){
        gl.useProgram(this.program);
        vmMatrix = mat4.create();
        mat4.translate(mvMatrix, [this.x, this.y, this.z]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(this.program.vertexPositionAttribute, this.buffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixUniforms(this.program);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.buffer.numItems);
    }

    this.update = function(){
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if(this.x > 1.5)
            this.vx *= -1;
        if(this.x < -5)
            this.vx *= -1;
        if(this.y > 2)
            this.vy *= -1;
        if(this.y < -2)
            this.vy *= -1;
        if(this.z > 2)
            this.vz *= -1;
        if(this.z < -2)
            this.vz *= -1;
    }

}
