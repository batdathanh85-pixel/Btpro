(()=>{
const $=id=>document.getElementById(id);let type='box',mode='pieces';
const defaults={box:6,square:6,round:6,flat:3,rebar:11.5};
function setType(t){type=t;document.querySelectorAll('#types .tab').forEach(b=>b.classList.toggle('active',b.dataset.type===t));
$('hWrap').classList.toggle('hidden',t!=='box'&&t!=='flat');$('tWrap').classList.toggle('hidden',t==='square'||t==='round'||t==='rebar');
$('wLabel').textContent=({box:'Chiều rộng ngoài (mm)',square:'Cạnh (mm)',round:'Đường kính (mm)',flat:'Bản rộng (mm)',rebar:'Đường kính phi (mm)'})[t];
$('tLabel').textContent=t==='flat'?'Độ dày (mm)':'Độ dày thành (mm)';
$('dimensionHint').textContent=({box:'Hộp vuông: nhập kích thước ngoài và độ dày thành.',square:'Vuông đặc: nhập cạnh.',round:'Tròn đặc và thép phi: nhập đường kính.',flat:'Sắt la: nhập bản rộng và độ dày.',rebar:'Thép tròn xây dựng: nhập đường kính phi.'})[t];
$('pieceLength').value=defaults[t];$('h').value=$('w').value;
}
function setMode(m){mode=m;[['pieces','modePieces'],['meters','modeMeters'],['list','modeList']].forEach(([v,b])=>{$(v+'Panel').classList.toggle('hidden',m!==v);$(b).classList.toggle('active',m===v)});calc()}
function parseList(){let raw=$('lengthList').value.trim();if(!raw)return [];let tokens=raw.split(/[+\s,;]+/).filter(Boolean);return tokens.map(x=>Number(x)).filter(x=>Number.isFinite(x)&&x>0)}
function length(){if(mode==='pieces')return Math.max(0,Number($('pieces').value)||0)*Math.max(0,Number($('pieceLength').value)||0);if(mode==='meters')return Math.max(0,Number($('meters').value)||0);let a=parseList(),factor={mm:.001,cm:.01,m:1}[$('listUnit').value];$('count').textContent=a.length;$('listTotal').textContent=(a.reduce((s,x)=>s+x,0)*factor).toLocaleString('vi-VN',{maximumFractionDigits:4})+' m';return a.reduce((s,x)=>s+x,0)*factor}
function kgPerM(){let a=Number($('w').value),b=Number($('h').value),t=Number($('t').value),rho=Number($('density').value)||7850;if(!(a>0))return NaN;let area;
if(type==='square')area=a*a;
else if(type==='round'||type==='rebar')area=Math.PI*a*a/4;
else if(type==='flat'){if(!(t>0))return NaN;area=a*t}
else{if(!(b>0&&t>0&&2*t<Math.min(a,b)))return NaN;area=a*b-(a-2*t)*(b-2*t)}
return area*1e-6*rho}
function fmt(n,d=2){return Number.isFinite(n)?n.toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d}):'–'}
function calc(){let L=length(),k=kgPerM(),kg=L*k,price=Number($('price').value);$('outLength').textContent=fmt(L,3)+' m';$('outKgM').textContent=fmt(k,4)+' kg/m';$('outKg').textContent=fmt(kg,3)+' kg';$('outMoney').textContent=$('price').value!==''&&price>=0?Math.round(kg*price).toLocaleString('vi-VN')+' đ':'Nhập đơn giá';}
document.querySelectorAll('#types .tab').forEach(b=>b.addEventListener('click',()=>setType(b.dataset.type)));
$('modePieces').onclick=()=>setMode('pieces');$('modeMeters').onclick=()=>setMode('meters');$('modeList').onclick=()=>setMode('list');
$('calculate').onclick=calc;
document.querySelectorAll('input,textarea,select').forEach(e=>e.addEventListener('input',calc));
setType('box');setMode('pieces');calc();
})();