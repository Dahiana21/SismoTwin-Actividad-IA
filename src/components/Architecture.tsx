import {useMemo} from 'react';
import {Canvas,ThreeEvent} from '@react-three/fiber';
import {OrbitControls,Grid,ContactShadows,Environment} from '@react-three/drei';
import type {Config} from '../lib/model';
import type {DecorItem,Finish} from '../store/useLab';
import {useLab} from '../store/useLab';

const palettes:Record<Finish,{wall:string;trim:string;accent:string;glass:string;floor:string}>={
 modern:{wall:'#c9d2d5',trim:'#f3f6f4',accent:'#385063',glass:'#4a91ae',floor:'#c0ad90'},
 brick:{wall:'#ab634c',trim:'#ece0cf',accent:'#443f3e',glass:'#4d879a',floor:'#b99976'},
 concrete:{wall:'#92999c',trim:'#d4d7d2',accent:'#333e48',glass:'#3a768d',floor:'#959b97'},
 luxury:{wall:'#e4dfd2',trim:'#ffffff',accent:'#a58459',glass:'#477b87',floor:'#b9a88f'}
};
function Block({at,size,color,roughness=.74,metalness=0,onClick}:{at:[number,number,number];size:[number,number,number];color:string;roughness?:number;metalness?:number;onClick?:(e:ThreeEvent<MouseEvent>)=>void}){return <mesh position={at} receiveShadow castShadow onClick={onClick}><boxGeometry args={size}/><meshStandardMaterial color={color} roughness={roughness} metalness={metalness}/></mesh>}
function Window({at,size,trim,glass}:{at:[number,number,number];size:[number,number,number];trim:string;glass:string}){return <group><Block at={at} size={size} color={trim}/><Block at={[at[0],at[1],at[2]+.025]} size={[size[0]-.11,size[1]-.12,size[2]+.03]} color={glass} roughness={.13} metalness={.3}/><Block at={[at[0],at[1],at[2]+.065]} size={[.06,size[1]-.1,.06]} color={trim}/></group>}
function Furnishing({item,c,selected,onSelect}:{item:DecorItem;c:Config;selected:boolean;onSelect:(id:string)=>void}){
 const y=(item.floor-1)*c.floorHeight+.37; const x=Math.max(-c.width/2+1,Math.min(c.width/2-1,item.x)),z=Math.max(-c.depth/2+1,Math.min(c.depth/2-1,item.z));
 const click=(e:ThreeEvent<MouseEvent>)=>{e.stopPropagation();onSelect(item.id)};
 const wood=item.style==='natural'?'#bb8a58':item.style==='dark'?'#43464b':'#e5dfd3';const cloth=item.style==='dark'?'#345062':item.style==='color'?'#4c8f8a':'#d4c4b0';
 return <group position={[x,y,z]} rotation={[0,item.rotation,0]} onClick={click}>
 {item.kind==='bed'&&<><Block at={[0,.18,0]} size={[2.05,.42,2.35]} color={wood}/><Block at={[0,.45,.1]} size={[1.9,.22,1.9]} color={cloth}/><Block at={[0,.62,-.72]} size={[1.7,.14,.38]} color="#f2eee8"/><Block at={[0,.95,-1.13]} size={[2.05,1.05,.16]} color={wood}/></>}
 {item.kind==='sofa'&&<><Block at={[0,.35,0]} size={[2.3,.55,.95]} color={cloth}/><Block at={[0,.85,-.37]} size={[2.3,.65,.22]} color={cloth}/>{[-1.04,1.04].map(s=><Block key={s} at={[s,.63,0]} size={[.23,.65,1.02]} color={cloth}/>)}</>}
 {item.kind==='table'&&<><Block at={[0,.9,0]} size={[1.7,.12,1.05]} color={wood}/>{[-.7,.7].flatMap(xx=>[-.4,.4].map(zz=><Block key={`${xx}-${zz}`} at={[xx,.45,zz]} size={[.11,.85,.11]} color={wood}/>))}</>}
 {item.kind==='chair'&&<><Block at={[0,.5,0]} size={[.65,.13,.7]} color={wood}/><Block at={[0,.93,-.28]} size={[.65,.86,.1]} color={cloth}/>{[-.25,.25].flatMap(xx=>[-.25,.25].map(zz=><Block key={`${xx}-${zz}`} at={[xx,.23,zz]} size={[.08,.45,.08]} color={wood}/>))}</>}
 {item.kind==='wall'&&<Block at={[0,1.05,0]} size={[3,2.15,.18]} color={item.style==='dark'?'#4b5155':item.style==='color'?'#9cb7ac':'#efebe2'}/>}
 {item.kind==='plant'&&<><mesh position={[0,.3,0]} castShadow><cylinderGeometry args={[.35,.25,.62,12]}/><meshStandardMaterial color="#b67d59"/></mesh><mesh position={[0,1.05,0]} castShadow><sphereGeometry args={[.68,10,10]}/><meshStandardMaterial color="#3c7350"/></mesh></>}
 {item.kind==='lamp'&&<><mesh position={[0,.95,0]}><cylinderGeometry args={[.04,.06,1.85,12]}/><meshStandardMaterial color={wood} metalness={.6}/></mesh><mesh position={[0,1.95,0]}><coneGeometry args={[.55,.7,16,1,true]}/><meshStandardMaterial color="#f7ddae" side={2}/></mesh><pointLight position={[0,1.75,0]} intensity={1.2} distance={5} color="#ffd9a2"/></>}
 {selected&&<mesh position={[0,1.1,0]}><boxGeometry args={[item.kind==='wall'?3.2:2.6,2.4,item.kind==='wall'?.5:2.7]}/><meshBasicMaterial color="#2bd6f0" wireframe transparent opacity={.75}/></mesh>}
 </group>;
}
export function ArchitectureCanvas({config,items,finish,openFacade,visibleFloor}:{config:Config;items:DecorItem[];finish:Finish;openFacade:boolean;visibleFloor:number}){
 const p=palettes[finish];const selected=useLab(s=>s.selected),setSelected=useLab(s=>s.setSelected);
 const floors=useMemo(()=>Array.from({length:config.floors},(_,i)=>i+1),[config.floors]);
 const hx=config.width/2,hz=config.depth/2;const only=(f:number)=>visibleFloor===0||f===visibleFloor;
 return <Canvas shadows dpr={[1,1.5]} gl={{antialias:true}} onPointerMissed={()=>setSelected(null)}>
 <color attach="background" args={['#172432']}/><fog attach="fog" args={['#172432',115,180]}/>
 <ambientLight intensity={1.9}/><hemisphereLight args={['#e2efff','#4a5548',1.4]}/><directionalLight castShadow position={[25,56,30]} intensity={3.1} shadow-mapSize={[2048,2048]} shadow-camera-left={-65} shadow-camera-right={65} shadow-camera-top={65} shadow-camera-bottom={-65}/>
 <OrbitControls target={[0,config.floors*config.floorHeight*.45,0]} minDistance={9} maxDistance={150} maxPolarAngle={Math.PI*.52} enableDamping/>
 <gridHelper args={[120,24,'#42606b','#314450']} position={[0,-.42,0]}/>
 <Block at={[0,-.55,0]} size={[config.width+8,.8,config.depth+8]} color="#747d7c"/>
 {floors.map(f=>only(f)&&<group key={f} position={[0,(f-1)*config.floorHeight,0]}>
 <Block at={[0,.13,0]} size={[config.width,.26,config.depth]} color={p.floor}/>
 <Block at={[0,config.floorHeight-.16,0]} size={[config.width,.32,config.depth]} color={p.trim}/>
 {[-1,1].map(sign=><group key={sign}>
 <Block at={[sign*hx,config.floorHeight/2,0]} size={[.25,config.floorHeight-.3,config.depth]} color={p.wall}/>
 {Array.from({length:Math.max(2,Math.floor(config.depth/4))},(_,j)=>{const nz=Math.max(2,Math.floor(config.depth/4));return <group key={j} position={[sign*(hx+.16),config.floorHeight*.56,-hz+(j+.5)*config.depth/nz]} rotation={[0,Math.PI/2,0]}><Window at={[0,0,0]} size={[config.depth/nz*.67,config.floorHeight*.47,.11]} trim={p.accent} glass={p.glass}/></group>})}
 </group>)}
 {!openFacade&&<Block at={[0,config.floorHeight/2,hz]} size={[config.width,config.floorHeight-.3,.26]} color={p.wall}/>}
 <Block at={[0,config.floorHeight/2,-hz]} size={[config.width,config.floorHeight-.3,.26]} color={p.wall}/>
 {Array.from({length:Math.max(2,Math.floor(config.width/3.8))},(_,j)=>{const nx=Math.max(2,Math.floor(config.width/3.8)),x=-hx+(j+.5)*config.width/nx;return <group key={j}>
 {!openFacade&&<Window at={[x,config.floorHeight*.58,hz+.17]} size={[config.width/nx*.73,config.floorHeight*.5,.10]} trim={p.accent} glass={p.glass}/>}<Window at={[x,config.floorHeight*.58,-hz-.16]} size={[config.width/nx*.73,config.floorHeight*.5,.10]} trim={p.accent} glass={p.glass}/>
 {!openFacade&&<><Block at={[x,config.floorHeight*.12,hz+.94]} size={[config.width/nx*.7,.12,1.8]} color={p.floor}/><Block at={[x,config.floorHeight*.34,hz+1.83]} size={[config.width/nx*.7,.08,.07]} color={p.accent} metalness={.5}/><Block at={[x,config.floorHeight*.23,hz+1.83]} size={[.05,.63,.07]} color={p.accent}/></>}
 </group>})}
 <Block at={[0,.16,hz+.7]} size={[config.width,.1,1.4]} color={p.accent}/>
 </group>)}
 {visibleFloor===0&&<><Block at={[0,config.floors*config.floorHeight+.13,0]} size={[config.width+.5,.28,config.depth+.5]} color={p.accent}/><Block at={[0,config.floors*config.floorHeight+.45,0]} size={[config.width*.2,.55,config.depth*.2]} color={p.trim}/></>}
 {items.filter(item=>item.floor<=config.floors&&only(item.floor)).map(item=><Furnishing key={item.id} item={item} c={config} selected={selected===item.id} onSelect={setSelected}/>)}
 </Canvas>;
}
