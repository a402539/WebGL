// Раскраска в 4 цвета триангуляции Делоне, заданной списком индексов вершин треугольников
// Триангуляцию Делоне см. в triangulate.js

function classmates(triangles) {
    incidence = []; // список прежних соседей
    for (var i = 0; i < triangles.length / 3; i++) {
        mates = [];
        if (i != 0) {
            i3 = 3*i;
            it = [triangles[i3], triangles[i3 + 1], triangles[i3+2]]; // вершины текущего треугольника
            for(var j=0; j<i; j++){  // предыдущие треугольники
                j3 = 3*j;
                jt = [triangles[j3], triangles[j3+1], triangles[j3+2]]; // вершины предыдущего треугольника
                intersection = new Set(it.concat(jt));
                if (intersection.size < 5){
                    mates.push(j);
                }
            }
        }
        incidence.push(mates);
    }
    console.log(incidence);
    return incidence;
}

function coloring(triangles) {
    incidence = classmates(triangles); // список прежних соседей
    incidence = [];
    colors = []; // раскрашивание треугольников
    for (var i = 0; i < triangles.length / 3; i++) {
        mates = [];
        color = new Set([0, 1, 2, 3]); // по умолчанию допустимы 4 цвета
        if (i != 0) {
            i3 = 3 * i;
            it = [triangles[i3], triangles[i3 + 1], triangles[i3 + 2]]; // вершины текущего треугольника
            for (var j = 0; j < i; j++) { // предыдущие треугольники
                j3 = 3 * j;
                jt = [triangles[j3], triangles[j3 + 1], triangles[j3 + 2]]; // вершины предыдущего треугольника
                intersection = new Set(it.concat(jt));
                if (intersection.size < 5) {
                    mates.push(j);
                    color.delete(colors[j]);
                }
            }
        }
        incidence.push(mates);
        colors.push([...color][0]);
    }
    console.log(colors);
    colors2 = coloring2(incidence);
    return colors;
}

function classmates2(triangles) {
    //console.log('classmates2: in');
    incidence = []; // список прежних соседей
    for (var i = 0; i < triangles.length / 3; i++) {
        mates = [];
        i3 = 3 * i;
        it = [triangles[i3], triangles[i3 + 1], triangles[i3 + 2]]; // вершины текущего треугольника
        for (var j = 0; j< triangles.length / 3; j++) { // все другие треугольники
            if (j==i) continue;
            j3 = 3 * j;
            jt = [triangles[j3], triangles[j3 + 1], triangles[j3 + 2]]; // вершины другого треугольника
            intersection = new Set(it.concat(jt));
            if (intersection.size < 5) {
                mates.push(j);
            }
        }
        incidence.push(mates);
    }
    //console.log('classmates2: incidence', incidence);
    return incidence;
}

function coloring2(incidence, stack) {
    var ilength = incidence.length;
    //console.log('coloring2: incidence length #', ilength);
    var n = 0;
    while (stack.length < ilength && n++ < 100) {
        //console.log('n=', n);
        for (var i=0; i<ilength; i++) {
            if (stack.indexOf(i) != -1) continue;
            mates = incidence[i];
            //console.log('i=', i, 'mates=', mates, 'stack=', stack);
            if ( mates.length < 3 ||
                stack.indexOf(mates[0]) != -1 ||
                stack.indexOf(mates[1]) != -1 ||
                stack.indexOf(mates[2]) != -1 )
                {
                stack.unshift(i);
                //console.log('n, stack', n, stack);
                break;
            }
            //console.log('встретился внутренний треугольник с тремя такими же соседями');
        }
        //console.log('n=', n, 'stack.length', stack.length, 'stack=', stack);
    }
}
/*
incidence
0: (2)[1, 2]
1: (3)[0, 4, 5]
2: (2)[0, 5]
3: (2)[4, 5]
4: (2)[1, 3]
5: (3)[1, 2, 3]
stack["4", "3", "2", "0"]
*/
function color3(incidence, stack){
    colors = {};
    if(stack.length == 0){
        return colors;
    }
    if (stack.length == 1) {
        colors[stack[0]] = 0;
        return colors;
    }
    for (var i=0; i < incidence.length; i++){
        var mates = incidence[stack[i]];
        var col = {0:1, 1:1, 2:1};
        for(var m=0; m<mates.length; m++){
            if(colors[mates[m]] != undefined){
                delete col[colors[mates[m]]];
            }
        }
        colors[stack[i]] = Number(Object.keys(col)[0]);
    }
    return colors;
}
/* 
incidence [[1],[0,3],[3],[1,2]]
0: [1]
1: (2)[0, 3]
2: [3]
3: (2)[1, 2]
stack [3, 2, 1, 0]
colors { 0: 0, 1: 1, 2: 0, 3: 0 }
*/

function check_colors(incidence, colors) {
    console.log('check_color: start');
    for (var i=0; i<incidence.length; i++){
        var mates = incidence[i], colori = colors[i];
        for (var j=0; j<mates.length; j++){
            if (colors[mates[j]]==colori){
                console.log('Ошибка', i, colori, mates);
            }
        }
    }
    console.log('check_color: finish');
}