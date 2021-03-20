var points = [];
var points1 = [];

var txt = document.getElementById("txt");
var canvas2d = document.getElementById("canvas");
var ctx = canvas2d.getContext("2d");
canvas2d.onclick = function (ev) {
	//console.log('клик ev',ev);
	window.points1.push([ev.layerX, ev.layerY]);
	points.push(2 * ev.layerX / ev.target.width - 1, 1 - 2 * ev.layerY / ev.target.height);
	//window._ctx = ctx;
	ctx.beginPath();
	ctx.arc(ev.layerX, ev.layerY, 5, 0, Math.PI * 2, true);
	ctx.stroke();
	if (points.length > 2) {
		initBuffers(points);
		draw();
	}
	txt.innerHTML = points.join(',\n');
	//console.log('points', points);
};
var gl;
var shaderProgram;
var vertexBuffer; // буфер вершин
var indexBuffer; //буфер индексов
// установка шейдеров
function initShaders() {
	var fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
	var vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');

	shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Не удалось установить шейдеры");
	}
	gl.useProgram(shaderProgram);

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
}
// Функция создания шейдера
function getShader(type, id) {
	var source = document.getElementById(id).innerHTML;

	var shader = gl.createShader(type);

	const [minSizeP, maxSizeP] = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
	// console.log('Point size [minSize, maxSize]', [minSizeP, maxSizeP]);
	const [minSizeL, maxSizeL] = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);
	// console.log('Line width [minSize, maxSize]', [minSizeL, maxSizeL]);

	gl.shaderSource(shader, source);

	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("Ошибка компиляции шейдера: " + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}
// установка буферов вершин и индексов
function initBuffers(points) {

	vertices = points;
	/*
	[-0.5, -0.5, 0.0,
		-0.5, 0.5, 0.0,
		0.0, 0.0, 0.0,
		0.5, 0.5, 0.0,
		0.5, -0.5, 0.0
	];
	*/

	indices = [];
	for (var i = 0; 2 * i < vertices.length - 2; i++) {
		indices.push(i, i + 1);
	}
	// console.log('indices', indices);
	// [0, 1, 1, 2, 2, 3, 3, 4];
	// установка буфера вершин
	vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	vertexBuffer.itemSize = 2;

	// создание буфера индексов
	indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	// указываем число индексов это число равно числу индексов
	indexBuffer.numberOfItems = indices.length;
}

function draw() {

	gl.clearColor(1, 1, 1, 1);

	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
		vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
	// отрисовка треугольников
	gl.drawElements(gl.LINES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);
}

window.onload = function () {

	var canvas = document.getElementById("canvas3D");
	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	} catch (e) {}

	if (!gl) {
		alert("Ваш браузер не поддерживает WebGL");
	}
	if (gl) {
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;

		initShaders();

		initBuffers([]);

		draw();
	}

	var value = true; 
	//условие появления кнопки, true - появиться, false - нет
	var btn = document.createElement('button'); //создаём нашу кнопку
	btn.onclick = function (ev) {
		triang(points1);
	};

	var textInBtn = document.createTextNode('Триангуляция'); //создаем текст для кнопки

	btn.appendChild(textInBtn); //добавляем текст в кнопку

	if (value) { //в зависимости от условия добавляем кнопку в документ
		document.body.appendChild(btn);
	} else {
		// удаление соответственно по необходимости:
		btn.remove();
	}

};

function triang(pts) {
	// отрисовка триангуляции
	console.log(pts);
	//ctx = window._ctx;
	ctx.strokeStyle = "red";
	let triangles = triangulate(pts);
	// отрисовка сгенерированных точек
	for (let i = 0; i < pts.length; i++) {
		ctx.beginPath();
		ctx.arc(pts[i][0], pts[i][1], 15, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	} 
	// отрисовка треугольников 
	for (let i=0; i < triangles.length;) {
		ctx.beginPath();
		ctx.moveTo(pts[triangles[i]][0], pts[triangles[i]][1]);
		i++;
		ctx.lineTo(pts[triangles[i]][0], pts[triangles[i]][1]);
		i++;
		ctx.lineTo(pts[triangles[i]][0],
			pts[triangles[i]][1]);
		i++;
		ctx.closePath();
		ctx.stroke();
	}
}
