// thx: http://wgld.org/

// canvasエレメントを取得
var c=document.getElementById('canvas');
c.width=window.innerWidth;
c.height=window.innerHeight;

// webglコンテキストを取得
var gl=c.getContext('webgl')||c.getContext('experimental-webgl');

gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

// 頂点シェーダとフラグメントシェーダの生成
var vert=create_shader("vert");
var frag=create_shader("frag");

// プログラムオブジェクトの生成とリンク
var prg=create_program(vert,frag);

var pos=[];
var nor=[];
var col=[];
var index=[];

addPoly([99,99,-8,-99,99,-8,-99,-99,-8,99,-99,-8],1);
addPolyCube(10,2,2,0);
addPoly([0,5,1,-2,2,1,2,2,1],2);
addPoly([1,2,1,-1,2,1,-1,-2,1,1,-2,1],2);
addPoly([0,-5,1,2,-2,1,-2,-2,1],2);
addPoly([0,5,-1,2,2,-1,-2,2,-1],2);
addPoly([-1,2,-1,1,2,-1,1,-2,-1,-1,-2,-1],2);
addPoly([0,-5,-1,-2,-2,-1,2,-2,-1],2);
addPoly([0,5,-1,0,5,1,2,2,1,2,2,-1],2);
addPoly([2,2,-1,2,2,1,1,2,1,1,2,-1],2);
addPoly([1,2,-1,1,2,1,1,-2,1,1,-2,-1],2);
addPoly([1,-2,-1,1,-2,1,2,-2,1,2,-2,-1],2);
addPoly([2,-2,-1,2,-2,1,0,-5,1,0,-5,-1],2);
addPoly([0,5,1,0,5,-1,-2,2,-1,-2,2,1],2);
addPoly([-2,2,1,-2,2,-1,-1,2,-1,-1,2,1],2);
addPoly([-1,2,1,-1,2,-1,-1,-2,-1,-1,-2,1],2);
addPoly([-1,-2,1,-1,-2,-1,-2,-2,-1,-2,-2,1],2);
addPoly([-2,-2,1,-2,-2,-1,0,-5,-1,0,-5,1],2);
addPoly([1,1,0,-1,1,0,-1,-1,0,1,-1,0],3);
addPoly([-1,1,0,1,1,0,1,-1,0,-1,-1,0],4);

setAtt('att_pos',pos,3);
setAtt('att_nor',nor,3);
setAtt('att_col',col,3);

var ibo=create_ibo(index);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);

var tex=[];
tex[0]=null;create_texture('tumblr.png',0);
tex[1]=null;create_texture('death.png',1);

var t=0.1;
var mouseX=0;
var mouseY=0;
var mouseCam=false;

document.onmousemove=function(e)
{
	mouseX=e.clientX-window.innerWidth/2;
	mouseY=e.clientY-window.innerHeight/2;
}

document.onmousedown=function()
{
	mouseCam=mouseCam?false:true;
}

function vec3RotateX(_v,_t)
{
	return [_v[0],_v[1]*Math.cos(_t)-_v[2]*Math.sin(_t),_v[1]*Math.sin(_t)+_v[2]*Math.cos(_t)];
}

function vec3RotateY(_v,_t)
{
	return [_v[2]*Math.sin(_t)+_v[0]*Math.cos(_t),_v[1],_v[2]*Math.cos(_t)-_v[0]*Math.sin(_t)];
}

function vec3RotateZ(_v,_t)
{
	return [_v[0]*Math.sin(_t)+_v[1]*Math.cos(_t),_v[0]*Math.cos(_t)-_v[1]*Math.sin(_t),_v[2]];
}

function disp()
{
	gl.clearColor(0.,0.,0.,1.);
	gl.clearDepth(1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var p=(Math.pow(.9,t%64)*.5);

	var m=new matIV();
	
	var matV=m.identity(m.create());
	var matP=m.identity(m.create());
	var uni_matVP=m.identity(m.create());
	var camPos=mouseCam?vec3RotateY(vec3RotateX([0,0,14],mouseY*.003),mouseX*.003):[0,0,14];
	m.lookAt(camPos,[0,0,0],[0,1,0],matV);
	m.perspective(90,c.width/c.height,0.1,100,matP);
	m.multiply(matP,matV,uni_matVP);
	gl.uniformMatrix4fv(gl.getUniformLocation(prg,'uni_matVP'),false,uni_matVP);

	var uni_mat0=m.identity(m.create());
	m.translate(uni_mat0,[0,5.5,0],uni_mat0);
	m.rotate(uni_mat0,-p*Math.PI,[1,0,0],uni_mat0);
	m.scale(uni_mat0,[1.5,1.5,1.5],uni_mat0);
	gl.uniformMatrix4fv(gl.getUniformLocation(prg,'uni_mat0'),false,uni_mat0);

	var uni_mat2=m.identity(m.create());
	m.rotate(uni_mat2,-p*Math.PI*2,[0,1,0],uni_mat2);
	m.scale(uni_mat2,[.6,.6,.6],uni_mat2);
	gl.uniformMatrix4fv(gl.getUniformLocation(prg,'uni_mat2'),false,uni_mat2);

	var uni_mat3=m.identity(m.create());
	m.translate(uni_mat3,[0,-7,0],uni_mat3);
	m.scale(uni_mat3,[3,3,3],uni_mat3);
	gl.uniformMatrix4fv(gl.getUniformLocation(prg,'uni_mat3'),false,uni_mat3);

	gl.uniform1f(gl.getUniformLocation(prg,'uni_t'),t);
	gl.uniform1f(gl.getUniformLocation(prg,'uni_p'),p);
	gl.uniform2fv(gl.getUniformLocation(prg,'uni_s'),[c.width,c.height]);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, tex[0]);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.uniform1i(gl.getUniformLocation(prg,'uni_tex0'),0);

	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, tex[1]);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
	gl.uniform1i(gl.getUniformLocation(prg,'uni_tex1'),1);

	gl.drawElements(gl.TRIANGLES,index.length,gl.UNSIGNED_SHORT,0);

	gl.flush();

	t++;
	setTimeout("disp()",20);
}
disp();

function addPoly(_i,_c)
{
	l=_i.length;
	for(var c=6;c<l;c+=3)
	{
		for(var c2=0;c2<3;c2++)
		{
			pos.push(_i[c2]);
		}
		for(var c2=c-3;c2<c+3;c2++)
		{
			pos.push(_i[c2]);
		}

		{
			var x=(_i[c-2]-_i[1])*(_i[c+2]-_i[c-1])-(_i[c-1]-_i[2])*(_i[c+1]-_i[c-2]);
			var y=(_i[c-1]-_i[2])*(_i[c]-_i[c-3])-(_i[c-3]-_i[0])*(_i[c+2]-_i[c-1]);
			var z=(_i[c-3]-_i[0])*(_i[c+1]-_i[c-2])-(_i[c-2]-_i[1])*(_i[c]-_i[c-3]);
			for(var c2=0;c2<3;c2++)
			{
				nor.push(x);nor.push(y);nor.push(z);
			}
		}

		for(var c2=0;c2<3;c2++)
		{
			index.push(col.length/3);
			switch(c2)
			{
				case 0:col.push(1,1);break;
				case 1:col.push(0,c==6?1:0);break;
				case 2:col.push(c==6?0:1,0);break;
			}
			col.push(_c);
		}
	}
}

function addPolyCube(_w,_h,_d,_c)
{
	var w=_w/2,h=_h/2,d=_d/2;
	addPoly([w,h,d,-w,h,d,-w,-h,d,w,-h,d],_c);
	addPoly([-w,h,-d,w,h,-d,w,-h,-d,-w,-h,-d],_c);
	addPoly([w,h,-d,w,h,d,w,-h,d,w,-h,-d],_c);
	addPoly([-w,h,d,-w,h,-d,-w,-h,-d,-w,-h,d],_c);
	addPoly([w,h,-d,-w,h,-d,-w,h,d,w,h,d],_c);
	addPoly([w,-h,d,-w,-h,d,-w,-h,-d,w,-h,-d],_c);
}

function hsva(h, s, v, a){
    if(s > 1 || v > 1 || a > 1){return;}
    var th = h % 360;
    var i = Math.floor(th / 60);
    var f = th / 60 - i;
    var m = v * (1 - s);
    var n = v * (1 - s * f);
    var k = v * (1 - s * (1 - f));
    var color = new Array();
    if(!s > 0 && !s < 0){
        color.push(v, v, v, a); 
    } else {
        var r = new Array(v, n, m, m, k, v);
        var g = new Array(k, v, v, n, m, m);
        var b = new Array(m, m, k, v, v, n);
        color.push(r[i], g[i], b[i], a);
    }
    return color;
}

function torus(row, column, irad, orad){
    for(var i = 0; i <= row; i++){
        var r = Math.PI * 2 / row * i;
        var rr = Math.cos(r);
        var ry = Math.sin(r);
        for(var ii = 0; ii <= column; ii++){
            var tr = Math.PI * 2 / column * ii;
            var tx = (rr * irad + orad) * Math.cos(tr);
            var ty = ry * irad;
            var tz = (rr * irad + orad) * Math.sin(tr);
            var rx = rr * Math.cos(tr);
            var rz = rr * Math.sin(tr);
            pos.push(tx, ty, tz);
            nor.push(rx, ry, rz);
            col.push(0);
        }
    }
    for(i = 0; i < row; i++){
        for(ii = 0; ii < column; ii++){
            r = (column + 1) * i + ii;
            index.push(r, r + column + 1, r + 1);
            index.push(r + column + 1, r + column + 2, r + 1);
        }
    }
}

function resize()
{
	var w=window.innerWidth;
	var h=window.innerHeight;
	c.width=w;
	c.height=h;
	gl.viewport(0,0,w,h);
}
resize();
window.onresize=resize;

function create_shader(id){
	// シェーダを格納する変数
	var shader;
	
	// HTMLからscriptタグへの参照を取得
	var scriptElement = document.getElementById(id);
	
	// scriptタグが存在しない場合は抜ける
	if(!scriptElement){return;}
	
	// scriptタグのtype属性をチェック
	switch(scriptElement.type){
		
		// 頂点シェーダの場合
		case 'x-shader/x-vertex':
			shader = gl.createShader(gl.VERTEX_SHADER);
			break;
			
		// フラグメントシェーダの場合
		case 'x-shader/x-fragment':
			shader = gl.createShader(gl.FRAGMENT_SHADER);
			break;
		default :
			return;
	}
	
	// 生成されたシェーダにソースを割り当てる
	gl.shaderSource(shader, scriptElement.text);
	
	// シェーダをコンパイルする
	gl.compileShader(shader);
	
	// シェーダが正しくコンパイルされたかチェック
	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
		
		// 成功していたらシェーダを返して終了
		return shader;
	}else{
		
		// 失敗していたらエラーログをアラートする
		alert(gl.getShaderInfoLog(shader));
	}
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(vs, fs){
	// プログラムオブジェクトの生成
	var program = gl.createProgram();
	
	// プログラムオブジェクトにシェーダを割り当てる
	gl.attachShader(program, vs);
	gl.attachShader(program, fs);
	
	// シェーダをリンク
	gl.linkProgram(program);
	
	// シェーダのリンクが正しく行なわれたかチェック
	if(gl.getProgramParameter(program, gl.LINK_STATUS)){
	
		// 成功していたらプログラムオブジェクトを有効にする
		gl.useProgram(program);
		
		// プログラムオブジェクトを返して終了
		return program;
	}else{
		
		// 失敗していたらエラーログをアラートする
		alert(gl.getProgramInfoLog(program));
	}
}

// VBOを生成する関数
function create_vbo(data){
	// バッファオブジェクトの生成
	var vbo = gl.createBuffer();
	
	// バッファをバインドする
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
	
	// バッファにデータをセット
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	
	// バッファのバインドを無効化
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	// 生成した VBO を返して終了
	return vbo;
}

// IBOを生成する関数
function create_ibo(data){
	// バッファオブジェクトの生成
	var ibo = gl.createBuffer();
	
	// バッファをバインドする
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
	
	// バッファにデータをセット
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
	
	// バッファのバインドを無効化
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	
	// 生成したIBOを返して終了
	return ibo;
}

function setAtt(_n,_v,_s)
{
	var loc=gl.getAttribLocation(prg,_n);
	var str=_s;

	var vbo=create_vbo(_v);

	gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc,str,gl.FLOAT,false,0,0);
}

function create_texture(source,_n){
    // イメージオブジェクトの生成
    var img = new Image();
    
    // データのオンロードをトリガーにする
    img.onload = function(){
        // テクスチャオブジェクトの生成
        var t = gl.createTexture();
        
        // テクスチャをバインドする
        gl.bindTexture(gl.TEXTURE_2D, t);
        
        // テクスチャへイメージを適用
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        
        // ミップマップを生成
        gl.generateMipmap(gl.TEXTURE_2D);
        
        // テクスチャのバインドを無効化
        gl.bindTexture(gl.TEXTURE_2D, null);
        
        // 生成したテクスチャをグローバル変数に代入
        tex[_n] = t;
    };
    
    // イメージオブジェクトのソースを指定
    img.src = source;
}