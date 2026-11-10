import {Canvas,ThreeEvent} from '@react-three/fiber';
import {OrbitControls,Grid,PerspectiveCamera,} from '@react-three/drei';
import {useMemo} from 'react';
import {makeMembers,type Config,type Member} from '../lib/model';
import {useLab} from '../store/useLab';
import type {SimResult} from '../lib/simulation';
function Element({el,displace=0,tilt=0,columnStretch=1,muted=false,heatColor}:{el:Member;displace?:number;tilt?:number;columnStretch?:number;muted?:boolean;heatColor?:string}){
 const selected=useLab(s=>s.selected),setSelected=useLab(s=>s.setSelected);
 const color=el.kind==='foundation'?'#2c4f6b':el.kind==='column'?'#38c5ee':el.kind==='beam'?'#80a8c5':el.kind==='slab'?'#466a83':el.kind==='wall'?'#4ea6b7':'#ffd16a';
 return <mesh position={[el.pos[0]+displace,el.pos[1],el.pos[2]]} rotation={[0,0,tilt]} onClick={(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();setSelected(el.id)}}>
 <boxGeometry args={el.kind==='column'?[el.size[0],el.size[1]*columnStretch,el.size[2]]:el.size}/><meshStandardMaterial color={selected===el.id?'#ffb64f':heatColor??color} transparent opacity={el.kind==='wall'?.13:muted?.75:1} metalness={.32} roughness={.52} depthWrite={el.kind!=='wall'}/>
 </mesh>;
}
function Building({config,progress,sim,frame,amplification,muted=false,scenario=false,heatmap=false}:{config:Config;progress:number;sim?:SimResult;frame:number;amplification:number;muted?:boolean;scenario?:boolean;heatmap?:boolean}){
 const members=useMemo(()=>makeMembers(config),[config]);
 const current=sim?.floors[Math.min(frame,sim.steps)];
 const currentDrifts=current?.map((v,i)=>Math.abs(v-(i?current[i-1]:0)))??[];
 const maxScale=sim?Math.max(...sim.drift,1e-12):1;
 const colorAt=(floor:number)=>{const q=Math.min(1,(currentDrifts[floor-1]??0)/maxScale);return q<.01?'#38bdf8':q<.33?'#31c6e6':q<.66?'#fbbf59':'#f87171'};
 return <group>{members.filter(e=>e.phase<=Math.min(5,Math.floor(progress*6))).map(e=>{
  const top=sim&&e.floor>0?sim.floors[Math.min(frame,sim.steps)][e.floor-1]*amplification:0;
  const lower=sim&&e.floor>1?sim.floors[Math.min(frame,sim.steps)][e.floor-2]*amplification:0;
  const extra=scenario&&sim&&frame>sim.steps*.72?Math.max(0,frame/sim.steps-.72)*Math.pow(e.floor/config.floors,2)*1.8:0;
  const displace=(e.kind==='column'?(top+lower)/2:top)+extra;
  // La columna conecta exactamente el nodo inferior con el superior.
  // El factor de amplificación afecta solo la representación, no los resultados numéricos.
  const tilt=e.kind==='column'?-Math.atan2(top-lower,config.floorHeight):0;
  const columnStretch=e.kind==='column'?Math.hypot(config.floorHeight,top-lower)/config.floorHeight:1;
  return <Element key={e.id} el={e} displace={displace} tilt={tilt} columnStretch={columnStretch} muted={muted} heatColor={heatmap&&sim&&e.floor>0&&e.kind!=='wall'&&e.kind!=='foundation'?colorAt(e.floor):undefined}/>;
 })}</group>;
}
export function BuildingCanvas({config,progress,sim,frame,compare=false,amplification=30,scenario=false,heatmap=false}:{config:Config;progress:number;sim?:SimResult;frame:number;compare?:boolean;amplification?:number;scenario?:boolean;heatmap?:boolean}){
 const view=useLab(s=>s.view),setSelected=useLab(s=>s.setSelected);
 const cameraPosition:[number,number,number]=view==='top'?[.01,68,.01]:view==='front'?[0,25,65]:[44,35,48];
 return <Canvas shadows dpr={[1,1.7]} onPointerMissed={()=>setSelected(null)} gl={{antialias:true}}>
 <color attach="background" args={['#081322']}/><fog attach="fog" args={['#081322',75,155]}/>
 <ambientLight intensity={1.6}/><directionalLight position={[18,36,24]} intensity={2.4}/><pointLight position={[-30,22,-15]} intensity={25} color="#36dcff"/>
 <PerspectiveCamera key={view} makeDefault position={cameraPosition} fov={48} near={.1} far={250}/>
 <OrbitControls key={`orbit-${view}`} makeDefault target={[0,config.floors*config.floorHeight/2,0]} minDistance={18} maxDistance={130} maxPolarAngle={Math.PI*.495} enableDamping/>
 <Grid position={[0,-.89,0]} args={[130,130]} cellColor="#15334b" sectionColor="#275271" cellSize={3} sectionSize={15} fadeDistance={110} infiniteGrid/>
 <Building config={config} progress={progress} sim={sim} frame={frame} amplification={compare?18:amplification} scenario={scenario} heatmap={heatmap}/>
 </Canvas>;
}
