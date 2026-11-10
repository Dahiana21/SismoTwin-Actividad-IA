import type {Config,Seismic} from './model';
export type SimResult={time:number[]; floors:number[][]; drift:number[]; maxDisp:number;maxDrift:number;peakAccel:number;period:number;steps:number};
function solve(A:number[][],b:number[]):number[]{
 const n=b.length;const a=A.map((r,i)=>[...r,b[i]]);
 for(let i=0;i<n;i++){let max=i;for(let j=i+1;j<n;j++)if(Math.abs(a[j][i])>Math.abs(a[max][i]))max=j;
  [a[i],a[max]]=[a[max],a[i]];const pivot=a[i][i];if(Math.abs(pivot)<1e-15)throw new Error('Matriz estructural singular');
  for(let j=i+1;j<n;j++){const z=a[j][i]/pivot;for(let k=i;k<=n;k++)a[j][k]-=z*a[i][k];}
 }
 const x=Array(n).fill(0);for(let i=n-1;i>=0;i--){let s=a[i][n];for(let j=i+1;j<n;j++)s-=a[i][j]*x[j];x[i]=s/a[i][i];}return x;
}
export function compute(c:Config,s:Seismic):SimResult {
 const n=c.floors,dt=.02,steps=Math.round(s.duration/dt),mass=c.width*c.depth*.85*1000; // kg / piso: masa tributaria ilustrativa
 const factor=c.structure==='arriostrada'?1.9:c.structure==='flexible'?.65:1;
 const storyK=18e6*factor*c.stiffness*(c.colsX*c.colsZ/12)*(3.2/c.floorHeight)**3; // N/m
 const k=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>i===j?(i===n-1?storyK:2*storyK):(Math.abs(i-j)===1?-storyK:0)));
 const m=mass, w=Math.sqrt(storyK/m), cStory=2*s.damping*m*w;
 const damp=k.map(row=>row.map(v=>v/storyK*cStory));
 const beta=.25,gamma=.5,a0=1/(beta*dt*dt),a1=gamma/(beta*dt),a2=1/(beta*dt),a3=1/(2*beta)-1,a4=gamma/beta-1,a5=dt*(gamma/(2*beta)-1);
 const Keff=k.map((r,i)=>r.map((v,j)=>v+a1*damp[i][j]+(i===j?a0*m:0)));
 let u=Array(n).fill(0),v=Array(n).fill(0),acc=Array(n).fill(0);
 const time:number[]=[],floors:number[][]=[],drift=Array(n).fill(0);let maxDisp=0,maxDrift=0,peakAccel=0;
 for(let step=0;step<=steps;step++){
  const t=step*dt;time.push(t);floors.push([...u]);
  for(let i=0;i<n;i++){maxDisp=Math.max(maxDisp,Math.abs(u[i]));const d=Math.abs(u[i]-(i?u[i-1]:0));drift[i]=Math.max(drift[i],d);maxDrift=Math.max(maxDrift,d);}
  if(step===steps)break;
  const tn=(step+1)*dt;
  const envelope=Math.sin(Math.PI*tn/s.duration)**2;
  const ag=s.amplitude*9.81*Math.sin(2*Math.PI*s.frequency*tn)*envelope;
  peakAccel=Math.max(peakAccel,Math.abs(ag));
  const rhs=Array.from({length:n},(_,i)=>{
   let val=-m*ag+m*(a0*u[i]+a2*v[i]+a3*acc[i]);
   for(let j=0;j<n;j++)val+=damp[i][j]*(a1*u[j]+a4*v[j]+a5*acc[j]);return val;
  });
  const nu=solve(Keff,rhs);const na=nu.map((x,i)=>a0*(x-u[i])-a2*v[i]-a3*acc[i]);const nv=nu.map((_,i)=>v[i]+dt*((1-gamma)*acc[i]+gamma*na[i]));
  u=nu;v=nv;acc=na;
 }
 return {time,floors,drift,maxDisp,maxDrift,peakAccel,period:2*Math.PI/Math.sqrt(storyK/m),steps};
}
export function sampleData(a:SimResult,b?:SimResult){const data=[];for(let i=0;i<a.time.length;i+=5){data.push({time:+a.time[i].toFixed(2),A:+(1000*a.floors[i][a.floors[i].length-1]).toFixed(4),...(b?{B:+(1000*b.floors[i][b.floors[i].length-1]).toFixed(4)}:{})});}return data;}
