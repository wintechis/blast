var se=Object.create;var A=Object.defineProperty;var ae=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var de=Object.getPrototypeOf,le=Object.prototype.hasOwnProperty;var ue=(o,e)=>{for(var t in e)A(o,t,{get:e[t],enumerable:!0})},j=(o,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of ce(e))!le.call(o,i)&&i!==t&&A(o,i,{get:()=>e[i],enumerable:!(r=ae(e,i))||r.enumerable});return o};var pe=(o,e,t)=>(t=o!=null?se(de(o)):{},j(e||!o||!o.__esModule?A(t,"default",{value:o,enumerable:!0}):t,o)),be=o=>j(A({},"__esModule",{value:!0}),o);var Ae={};ue(Ae,{BluetoothAdapter:()=>U,EddystoneHelpers:()=>re,HidAdapter:()=>k,default:()=>H});module.exports=be(Ae);var b=require("@node-wot/core"),W=require("@node-wot/core/dist/interaction-output.js"),ne=require("json-placeholder-replacer"),$=require("@node-wot/binding-http");var ge=require("@node-wot/td-tools");var P=require("@node-wot/core"),N=require("rxjs"),R=require("stream"),{debug:p}=(0,P.createLoggers)("binding-bluetooth","gatt-client"),w=class{bluetoothAdapter;subscriptions;constructor(e){p("created client"),this.bluetoothAdapter=e,this.subscriptions=new Map}toString(){return"[GattClient]"}async readResource(e){let t=this.deconstructForm(e),r=await this.bluetoothAdapter.getCharacteristic(t.deviceId,t.serviceId,t.characteristicId);p(`invoking "readValue" on characteristic ${t.characteristicId}`);let i=await r.readValue(),a;e["bdo:signed"]?a=new Int8Array(i.buffer):a=new Uint8Array(i.buffer),p(`Received value: ${a}`);let s=R.Readable.from(a);return{type:e.contentType??"application/x.binary-data-stream",body:s,toBuffer:()=>P.ProtocolHelpers.readStreamFully(s)}}async writeResource(e,t){let r=this.deconstructForm(e),i;if(typeof t<"u"){let s=await t.toBuffer();i=s.buffer.slice(s.byteOffset,s.byteOffset+s.byteLength)}else i=new ArrayBuffer(1);let a=await this.bluetoothAdapter.getCharacteristic(r.deviceId,r.serviceId,r.characteristicId);switch(r.bleOperation){case"sbo:write-without-response":p(`invoking "writeValueWithoutResponse" on characteristic ${r.characteristicId}`),await a.writeValueWithoutResponse(i),p("writeValueWithoutResponse done");break;case"sbo:write":p(`invoking "writeValueWithResponse" on characteristic ${r.characteristicId}`),await a.writeValueWithResponse(i),p("writeValueWithResponse done");break;default:throw new Error(`unknown operation ${r["sbo:methodName"]}`)}}invokeResource(e,t){return this.writeResource(e,t).then(()=>Promise.resolve({type:"application/json",body:new R.Readable,toBuffer:async()=>Buffer.from([])}))}unlinkResource(e){let t=this.subscriptions.get(e.href);return t&&t.unsubscribe(),Promise.resolve()}async subscribeResource(e,t,r){let{deviceId:i,serviceId:a,characteristicId:s,bleOperation:n}=this.deconstructForm(e);if(n!=="sbo:notify"&&n!=="sbo:subscribe")throw new Error(`operation ${n} is not supported`);p(`subscribing to characteristic with serviceId ${a} characteristicId ${s}`);let c=u=>{p(`Received "characteristicvaluechanged" event: ${u}`);let f=u.target.value,h;e["bdo:signed"]?h=new Int8Array(f.buffer):h=new Uint8Array(f.buffer);let m=R.Readable.from(h);t({type:e.contentType??"application/x.binary-data-stream",body:m,toBuffer:()=>P.ProtocolHelpers.readStreamFully(m)})},d=await this.bluetoothAdapter.getCharacteristic(i,a,s);d.addEventListener("characteristicvaluechanged",c),await d.startNotifications();let l=new N.Subscription(()=>{d.stopNotifications(),d.removeEventListener("characteristicvaluechanged",c)});return this.subscriptions.set(e.href,l),l}async start(){}async stop(){p("Stopping client");for(let e of this.subscriptions.values())e.unsubscribe();this.subscriptions.clear()}setSecurity(){return!1}async requestThingDescription(e){throw new Error("BluetoothClient does not implement TD retrieval")}deconstructForm=function(e){let t={};t.path=e.href.split("://")[1];let r=t.path.split("/");if(r.length!==3){let i=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,a=r[0];for(let s=1;s<r.length;s++)i.test(r[s])===!1?a=a+"/"+r[s]:(s===r.length-2&&(t.serviceId=r[s]),s===r.length-1&&(t.characteristicId=r[s]));t.deviceId=a}else t.deviceId=r[0],t.serviceId=r[1],t.characteristicId=r[2];return t.operation=e.op?.toString()??"",t.bleOperation=e["sbo:methodName"],t}};var B=require("@node-wot/core");var q=pe(require("uritemplate"),1),x=class{getMediaType(){return"application/x.binary-data-stream"}bytesToValue(e,t){let r=null,i,a;if(typeof t["bdo:pattern"]<"u"){let s=fe(t,e);i=s[0],a=s[1];let n=[];for(let c=0;c<i.length;c++){let d=t["bdo:variables"][i[c]],l=a[c];switch(d.type){case"integer":case"number":n.push(G(d,l));break;case"string":n.push(K(d,l));break;case"object":n.push(J(d,l));break;default:throw new Error("Datatype not supported by codec")}r=n}}else switch(t.type){case"integer":case"number":r=G(t,e);break;case"string":r=K(t,e);break;case"object":r=J(t,e);break;default:throw new Error(`Datatype ${t.type} not supported by codec`)}return r}valueToBytes(e,t){let r=Buffer.alloc(1),i;if(typeof t["bdo:pattern"]<"u")i=he(t,e),r=V(t,i);else switch(t.type){case"number":case"integer":r=z(t,e);break;case"string":r=V(t,e);break;case"object":case"array":r=me(t,e);break}if(typeof t["tst:function"]<"u"){let a=t["tst:function"];r=new Function("buf",a)(r)}return r}};function G(o,e){let t=o["bdo:bytelength"]??e.byteLength,r=o["bdo:signed"]??!1,i=o["bdo:byteOrder"]??"little",a=o["bdo:scale"]??1,s=o["bdo:offset"]??0,n=o["bdo:precision"]??2;if(typeof t>"u")throw new Error("Not all parameters are provided!");let c=0;return i==="little"?r?c=e.readIntLE(s,t):c=e.readUIntLE(s,t):i==="big"&&(r?c=e.readIntBE(s,t):c=e.readUIntBE(s,t)),c=c*a,c=+(Math.round(+(c+"e+"+n))+"e-"+n),c}function z(o,e){let t=o["bdo:bytelength"],r=o["bdo:signed"]??!1,i=o["bdo:byteOrder"]??"little",a=o["bdo:scale"]??1,s=o["bdo:offset"]??0;if(typeof t>"u")throw new Error("Not all parameters are provided!");e=e*a;let n=Buffer.alloc(t);return i==="little"?r?n.writeIntLE(e,s,t):n.writeUIntLE(e,s,t):i==="big"&&(r?n.writeIntBE(e,s,t):n.writeUIntBE(e,s,t)),n}function fe(o,e){let t=o["bdo:pattern"],r=o["bdo:variables"],i=[],a=[],s=t.split("{");for(let d=0;d<s.length;d++){let l=s[d].split("}");d===0?i.push(l[0].length/2):(a.push(l[0]),i.push(l[1].length/2))}let n=[],c=0+i[0];for(let d=0;d<a.length;d++){let l=r[a[d]]["bdo:bytelength"];n.push(e.subarray(c,c+l)),c+=l+i[d+1]}return[a,n]}function he(o,e){let t,r;for([t,r]of Object.entries(o["bdo:variables"]))if(r.type==="integer"){let a=z(r,e[t]);e[t]=a.toString("hex")}return q.parse(o["bdo:pattern"]).expand(e)}function V(o,e){let t;if(typeof o.format>"u")return t=Buffer.from(e,"utf-8"),t;if(o.format==="hex")return t=Buffer.from(e,"hex"),t;throw Error("String can not be converted to bytes, format not supported")}function K(o,e){let t;if(typeof o.format>"u"?t=e.toString("utf-8"):o.format==="hex"&&(t=e.toString("hex")),typeof t>"u")throw Error("String can not be converted to bytes, format not supported");return t}function J(o,e){let t=e.toString("utf-8");return JSON.parse(t)}function me(o,e){let t;return Array.isArray(e)&&e.every(r=>typeof r=="number")?t=Buffer.from(e):t=Buffer.from(JSON.stringify(e)),t}var{debug:Y}=(0,B.createLoggers)("binding-bluetooth","gatt-client-factory"),v=class{scheme="gatt";clients=new Set;contentSerdes=B.ContentSerdes.get();adapter;constructor(e){this.contentSerdes.addCodec(new x),this.adapter=e}getClient(){Y(`Creating client for ${this.scheme}`);let e=new w(this.adapter);return this.clients.add(e),e}destroy(){return Y(`stopping all clients for '${this.scheme}'`),this.clients.forEach(e=>e.stop()),!0}init=()=>!0};var F=require("@node-wot/core");var D=require("@node-wot/core"),Q=require("rxjs"),_=require("stream"),{debug:M}=(0,D.createLoggers)("binding-bluetooth","gap-client"),T=class{bluetoothAdapter;subscriptions;constructor(e){M("created client"),this.bluetoothAdapter=e,this.subscriptions=new Map}toString(){return"[GapClient]"}async readResource(e){throw new Error("Method not implemented.")}async writeResource(e,t){throw new Error("Method not implemented.")}async invokeResource(e,t){throw new Error("Method not implemented.")}async unlinkResource(e){throw new Error("Method not implemented.")}subscribeResource(e,t,r){let i=async s=>{M(`Received GAP broadcast: ${s.target.manufacturerData[0].data}`);let n=s.target.manufacturerData[0].data;t({type:e.contentType??"application/x.binary-data-stream",body:_.Readable.from(n),toBuffer:()=>D.ProtocolHelpers.readStreamFully(_.Readable.from(n))})},a=e.href.split("/")[2];return this.bluetoothAdapter.observeGAP(a,i),Promise.resolve(new Q.Subscription)}async requestThingDescription(e){throw new Error("BluetoothClient does not implement TD retrieval")}async start(){}async stop(){M("Stopping client");for(let e of this.subscriptions.values())e.unsubscribe();this.subscriptions.clear()}setSecurity(){return!1}};var{debug:X}=(0,F.createLoggers)("binding-bluetooth","gap-client-factory"),C=class{scheme="gap";clients=new Set;contentSerdes=F.ContentSerdes.get();adapter;constructor(e){this.adapter=e}getClient(){X(`Creating client for ${this.scheme}`);let e=new T(this.adapter);return this.clients.add(e),e}destroy(){return X(`stopping all clients for '${this.scheme}'`),this.clients.forEach(e=>e.stop()),!0}init=()=>!0};var U=class{};var ye=require("@node-wot/td-tools");var y=require("@node-wot/core"),Z=require("rxjs"),L=require("stream"),{debug:g}=(0,y.createLoggers)("binding-hid","hid-client"),S=class{hidAdapter;subscriptions;constructor(e){g("created client"),this.hidAdapter=e,this.subscriptions=new Map}toString(){return"[Hid Client]"}async readResource(e){let t=e["hid:path"],r=await this.hidAdapter.getDevice(t),i=e["hid:reportId"],a=e["hid:reportLength"];if(i===void 0)throw new Error("Report ID cannot be undefined");if(a===void 0)throw new Error("Report length cannot be undefined");let s=await r.receiveFeatureReport(i),n;e.signed?n=new Int8Array(s.buffer):n=new Uint8Array(s.buffer);let c=L.Readable.from(n);return{type:e.contentType||"application/octet-stream",body:c,toBuffer:()=>y.ProtocolHelpers.readStreamFully(c)}}async writeResource(e,t){let r=e["hid:path"],i=await this.hidAdapter.getDevice(r),a=e.href.split("://")[1].split("/")[0],s=await t.toBuffer(),n;if(e["hid:data"]!==void 0){n=e["hid:data"];let d;e.signed?d=new Int8Array(s)[s.length-1]:d=new Uint8Array(s)[s.length-1],e["hid:valueIndex"]!==void 0&&(n[e["hid:valueIndex"]]=d)}else n=new Uint8Array(s);let c=e["hid:reportId"]||n[0];if(n=Buffer.from(n),a==="sendFeatureReport")g(`Sending feature report: ${c} ${n}`),await i.sendFeatureReport(c,n);else if(a==="sendReport")g(`Sending report: ${c} ${n}`),await i.sendReport(c,Buffer.from(n.subarray(1)));else throw new Error(`Method ${a} is not supported`)}async invokeResource(e,t){return await this.writeResource(e,t),Promise.resolve(new y.Content(e.contentType??"application/octet-stream",L.Readable.from([])))}unlinkResource(e){let t=this.subscriptions.get(e["hid:path"]);return t&&t.unsubscribe(),Promise.resolve()}async subscribeResource(e,t,r,i){let a=e["hid:path"],s=await this.hidAdapter.getDevice(a);g(`Subscribing to device:  ${a}`);let n=d=>{g(`Received "inputreport" event with report id: ${d.reportId} and data: ${d.data.buffer}`);let l;e.signed?l=new Int8Array(d.data.buffer):l=new Uint8Array(d.data.buffer);let u=L.Readable.from(l),f=new y.Content(e.contentType||"application/x.binary-data-stream",u);t(f)};s.addEventListener("inputreport",n);let c=new Z.Subscription(()=>{g("Removing 'inputreport' listener from device: ${id}"),s.removeEventListener("inputreport",n)});return this.subscriptions.set(a,c),c}async start(){}async stop(){g("Stopping client");for(let e of this.subscriptions.values())e.unsubscribe();this.subscriptions.clear()}async requestThingDescription(e){throw new Error("HidClient does not implement TD retrieval")}setSecurity(){return!1}};var te=require("@node-wot/core");var{debug:ee}=(0,te.createLoggers)("binding-hid","hid-client-factory"),I=class{scheme="hid";clients=new Set;adapter;constructor(e){this.adapter=e}getClient(){ee(`Creating client for ${this.scheme}`);let e=new S(this.adapter);return this.clients.add(e),e}destroy(){return ee(`stopping all clients for '${this.scheme}'`),this.clients.forEach(e=>e.stop()),!0}init=()=>!0};var k=class{};var we="a3c87500-8ed3-4bdf-8a39-a01bebede295";var ve={"a3c87501-8ed3-4bdf-8a39-a01bebede295":"Capabilities","a3c87502-8ed3-4bdf-8a39-a01bebede295":"Active Slot","a3c87503-8ed3-4bdf-8a39-a01bebede295":"Advertising Interval","a3c87504-8ed3-4bdf-8a39-a01bebede295":"Radio Tx Power","a3c87505-8ed3-4bdf-8a39-a01bebede295":"Advertised Tx Power","a3c87506-8ed3-4bdf-8a39-a01bebede295":"Lock State","a3c87507-8ed3-4bdf-8a39-a01bebede295":"Unlock","a3c87508-8ed3-4bdf-8a39-a01bebede295":"Public ECDH Key","a3c87509-8ed3-4bdf-8a39-a01bebede295":"EID Identity Key","a3c8750a-8ed3-4bdf-8a39-a01bebede295":"Adv Slot Data","a3c8750b-8ed3-4bdf-8a39-a01bebede295":"Factory Reset"},Ce=function(o,e){let t={mask:8*Math.pow(16,e-1),sub:-1*Math.pow(16,e)};return(parseInt(o,16)&t.mask)>0?t.sub+parseInt(o,16):parseInt(o,16)},Se=function(o){let e=[];for(let r=0;r<o.length;r+=2)e.push(Ce(o.substring(r,r+2),2));let t=[];for(let r=6;r<e.length;r++){let i=t[t.length-1];if(i&&i>=e[r])break;t.push(e[r])}return{specVersion:e[0],maxSlots:e[1],maxEidPerSlot:e[2],isVarriableAdvIntervalSupported:(e[3]&1)!==0,isVariableTxPowerSupported:(e[3]&2)!==0,isUidSupported:(e[5]&1)!==0,isUrlSupported:(e[5]&2)!==0,isTlmSupported:(e[5]&4)!==0,isEidSupported:(e[5]&8)!==0,supportedTxPowerLevels:t}},Ie=function(o){let e=function(n){let c=parseInt(n.substring(2,4),16),d=n.substring(4,24),l=n.substring(24,36);return{frameType:"UID",txPower:c,namespace:d,instance:l}},t=function(n){let c=parseInt(n.substring(2,4),16),d=n.substring(4,6),l="";switch(d){case"00":l="http://www.";break;case"01":l="https://www.";break;case"02":l="http://";break;case"03":l="https://";break;default:throw new Error("Eddystone URL scheme is not valid.")}let u=[".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"],f=n.substring(6,n.length),h=l;for(let m=0;m<f.length;m+=2){let O=parseInt(f.substring(m,m+2),16);O<u.length?h+=u[O]:h+=String.fromCharCode(O)}return{frameType:"URL",txPower:c,url:h}},r=function(n){let c=parseInt(n.substring(4,8),16),d=parseInt(n.substring(8,10),16)+parseInt(n.substring(10,12),16)/100,l=parseInt(n.substring(12,20),16),u=parseInt(n.substring(20,28),16);return{frameType:"TLM",batteryVoltage:c,beaconTemperature:d,pduCount:l,timeSinceReboot:u}},i=[];for(let n=0;n<o.length;n+=2)i.push(parseInt(o.substring(n,n+2),16));let a=new Uint8Array(i).reduce((n,c)=>n+("0"+c.toString(16)).slice(-2),""),s;switch(a[0]+a[1]){case"00":return s=e(a),s.namespace+s.instance;case"10":return s=t(a),s.url;case"20":return s=r(a),s.beaconTemperature;case"30":throw new Error("EID frame type is not supported by blast.");default:throw new Error("Eddystone frame type is not valid.")}},Ee=function(o,e){let t=function(i){let a=["http://www.","https://www.","http://","https://"],s=[".com/",".org/",".edu/",".net/",".info/",".biz/",".gov/",".com",".org",".edu",".net",".info",".biz",".gov"],n=[],c=0,d=new TextEncoder;for(let l=0;l<a.length;l++)if(i.startsWith(a[l])){n.push(l),c=a[l].length;break}for(;c<i.length;){let l=c;for(let u=0;u<s.length;u++)if(i.startsWith(s[u],c)){n.push(u),c+=s[u].length;break}l===c&&(n.push(d.encode(i[c])[0]),c++)}if(n.length>18)throw new Error("URL is too long.");return n.splice(0,0,16),new Uint8Array(n)},r;switch(e){case"URL":break;case"UID":break;case"TLM":throw new Error("TLM frame type is not writable.");case"EID":throw new Error("EID frame type is not writable.");default:throw new Error('Unkown frame type. Known types are "UID", "URL", "TLM", or "EID".')}if(e==="URL")r=t(o);else{if(!/^[0-9A-Fa-f]{32}$/.test(o))throw new Error("Eddystone UID must be 32 hexadecimal characters.");r="00"+o}return r},re={EDDYSTONE_CONFIG_SERVICE:we,EDDYSTONE_CHARACTERISTICS:ve,parseCapabilities:Se,decodeAdvertisingData:Ie,encodeAdvertisingData:Ee};var E=require("stream"),ie=require("web-streams-polyfill"),H=class{servient;wot;constructor(e,t){let r={port:8083,allowSelfSigned:!0};if(this.servient=new b.Servient,e){let i=new e;i&&(this.servient.addClientFactory(new v(i)),this.servient.addClientFactory(new C(i)))}if(t){let i=new t;i&&this.servient.addClientFactory(new I(i))}this.servient.addClientFactory(new $.HttpClientFactory(r)),this.servient.addClientFactory(new $.HttpsClientFactory(r))}async getServient(){return this.servient}async getWot(){return this.wot||(this.wot=await this.servient.start()),this.wot}async resetServient(){if(this.servient){let e=this.servient.getThings();Object.entries(e).forEach(async([t])=>{let r=this.servient.getThing(t);r&&await r.destroy()});try{await this.servient.shutdown()}catch{}}}async createExposedThing(e,t){if(t){let a={MacOrWebBluetoothId:t,HIDPATH:t};e=structuredClone(e),e=Pe(e,a)}return await(await this.getWot()).produce(e)}async createThing(e,t){let r=await this.createExposedThing(e,t);return await(await this.getWot()).consume(r.getThingDescription())}async createThingWithHandlers(e,t,r){let i=await this.createExposedThing(e,t);return r(i),Te(i)}},Pe=function(o,e={}){let t=new ne.JsonPlaceholderReplacer;return t.addVariableMap(e),t.replace(o)},Te=function(o){let e={};return e.id=o.getThingDescription().id,e.name=o.getThingDescription().title,e.getThingDescription=o.getThingDescription,e.subscribeEvent=async function(t,r,i,a){let s=o.events[t];if(s){let n={op:"subscribeEvent"};s.forms=[n];let c=d=>{let l=new W.InteractionOutput(d);l.form=n,r(l)};return o.__eventListeners.register(s,0,c),{active:!0,stop:async d=>{o.__eventListeners.unregister(s,0,c)}}}else throw new Error(`Event '${t}' not found`)},e.invokeAction=async function(t,r,i={}){let a={op:"invokeAction"};o.actions[t].forms=[a];let s=new E.Readable;r&&(s=oe(r));let n=o.actions[t].input?.type;if(!n)throw new Error(`Action '${t}' has no input type`);switch(n){case"string":case"boolean":case"number":n="text/plain";break;default:n="application/json"}let c=new b.Content(n,s),d=await o.handleInvokeAction(t,c,{formIndex:0,...i});return d===void 0&&(d=new b.Content(n,new E.Readable)),new W.InteractionOutput(d)},e.readProperty=async function(t,r={}){let i=o.properties[t];if(!i)throw new Error(`Property '${t}' not found`);let a={op:"readProperty"};i.forms=[a];let s=await o.handleReadProperty(t,{formIndex:0,...r});return new W.InteractionOutput(s,a)},e.writeProperty=async function(t,r,i={}){let a=o.properties[t];if(!a)throw new Error(`Property '${t}' not found`);let s={op:"writeProperty"};a.forms=[s];let n=new E.Readable;r&&(n=oe(r));let c=o.properties[t].type;if(!c)throw new Error(`Property '${t}' has no type`);switch(c){case"string":case"boolean":case"number":c="text/plain";break;default:c="application/json"}let d=new b.Content(c,n);await o.handleWriteProperty(t,d,{formIndex:0,...i})},e},oe=function(o){let e;return typeof ReadableStream<"u"&&o instanceof ReadableStream?e=b.ProtocolHelpers.toNodeStream(o):o instanceof ie.ReadableStream?e=b.ProtocolHelpers.toNodeStream(o):Array.isArray(o)||typeof o=="object"?e=E.Readable.from(Buffer.from(JSON.stringify(o),"utf-8")):e=E.Readable.from(Buffer.from(o.toString(),"utf-8")),e};0&&(module.exports={BluetoothAdapter,EddystoneHelpers,HidAdapter});
