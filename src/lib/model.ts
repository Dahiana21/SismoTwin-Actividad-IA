export type Structure = 'marcos' | 'arriostrada' | 'flexible';
export type Config = { floors: number; floorHeight: number; width: number; depth: number; colsX: number; colsZ: number; structure: Structure; walls: boolean; stiffness: number };
export type Seismic = { amplitude: number; frequency: number; duration: number; damping: number };
export type Member = { id: string; kind: 'foundation'|'column'|'beam'|'slab'|'wall'|'brace'; floor: number; phase: number; pos: [number,number,number]; size: [number,number,number] };
export const defaultConfig: Config = {floors:8,floorHeight:3.2,width:24,depth:18,colsX:4,colsZ:3,structure:'marcos',walls:true,stiffness:1};
export const defaultSeismic: Seismic = {amplitude:0.18,frequency:1.35,duration:12,damping:0.05};
export const phases = ['Cimentación','Columnas del nivel 1','Vigas y losas','Pisos superiores','Cerramientos','Edificio terminado'];
export function phaseFor(kind:Member['kind'], floor:number):number {if(kind==='foundation')return 0;if(kind==='wall')return 4;if(floor===1&&kind==='column')return 1;if(floor===1)return 2;return 3;}
export function makeMembers(c:Config):Member[]{
 const a:Member[]=[];const put=(kind:Member['kind'],floor:number,pos:[number,number,number],size:[number,number,number],id:string)=>a.push({kind,floor,pos,size,id,phase:phaseFor(kind,floor)});
 const dx=c.width/(c.colsX-1),dz=c.depth/(c.colsZ-1),ch=c.floorHeight;
 put('foundation',0,[0,-0.42,0],[c.width+3,0.85,c.depth+3],'foundation');
 for(let f=1;f<=c.floors;f++){
  const y=(f-.5)*ch;
  for(let ix=0;ix<c.colsX;ix++)for(let iz=0;iz<c.colsZ;iz++)put('column',f,[-c.width/2+ix*dx,y,-c.depth/2+iz*dz],[.48,ch,.48],`C-${f}-${ix}-${iz}`);
  for(let iz=0;iz<c.colsZ;iz++)for(let ix=0;ix<c.colsX-1;ix++)put('beam',f,[-c.width/2+(ix+.5)*dx,f*ch,-c.depth/2+iz*dz],[dx,.52,.4],`BX-${f}-${ix}-${iz}`);
  for(let ix=0;ix<c.colsX;ix++)for(let iz=0;iz<c.colsZ-1;iz++)put('beam',f,[-c.width/2+ix*dx,f*ch,-c.depth/2+(iz+.5)*dz],[.4,.52,dz],`BZ-${f}-${ix}-${iz}`);
  put('slab',f,[0,f*ch+.15,0],[c.width,.3,c.depth],`L-${f}`);
  if(c.structure==='arriostrada')for(let iz of [0,c.colsZ-1])put('brace',f,[0,y,-c.depth/2+iz*dz],[c.width,.12,.12],`D-${f}-${iz}`);
  if(c.walls){put('wall',f,[0,y,-c.depth/2],[c.width,ch-.42,.16],`W-${f}-N`);put('wall',f,[c.width/2,y,0],[.16,ch-.42,c.depth],`W-${f}-E`);}
 }
 return a;
}
export type Quantities={concrete:number; steel:number; facade:number; formwork:number; members:number};
export function quantities(c:Config):Quantities {
 const m=makeMembers(c);const concrete=m.filter(x=>['foundation','column','beam','slab'].includes(x.kind)).reduce((sum,x)=>sum+x.size[0]*x.size[1]*x.size[2],0);
 const steel=concrete*.115*(c.structure==='arriostrada'?1.08:1); // t (coeficiente ilustrativo)
 const facade=c.walls?2*(c.width+c.depth)*c.floorHeight*c.floors:0;
 return {concrete,steel,facade,formwork:concrete*4.1,members:m.length};
}
