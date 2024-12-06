import { useEffect, useRef, useState } from "react"
// import { data } from "react-router-dom";

export function Sender(){
    let [socket,setsocket]=useState<WebSocket|null>(null);
    const videoref=useRef<HTMLVideoElement|null>(null)

    // let p2:RTCPeerConnection|null;
    useEffect(()=>{

        const  socket=new WebSocket('ws://localhost:3000')
        socket.onopen=()=>{

            socket.send(JSON.stringify({type:'sender'}))
        }
        setsocket(socket)
    },[])

    let pc:RTCPeerConnection|null;
    async function createconnection(){

        if(!socket) return;

        pc= await new RTCPeerConnection();
        pc.onnegotiationneeded= async()=>{

            const createoffer=await pc?.createOffer();
            pc?.setLocalDescription(createoffer);
            socket.send(JSON.stringify({type:'createoffer',sdp:createoffer}))
        }

       pc.onicecandidate=(event)=>{
        if(event.candidate){console.log("candidate"+event.candidate)

            socket?.send(JSON.stringify({type:'icecandidate',candidate:event.candidate}))
        }
       }

       socket.onmessage=(event)=>{
        const message=JSON.parse(event.data);
        console.log(message.type)
        if(message.type==='createanswer'){
            if(pc!==null){

                pc.setRemoteDescription(message.sdp)
            }
        }else if(message.type==='icecandidate'){
            if(pc!==null){
                console.log("connected"+message.candiate)
                pc.addIceCandidate(message.candiate);
            }
        }

       }
       try{
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        //    let  stream=await new navigator.mediaDevices.getUserMedia({video:true})
        if(videoref.current){

            videoref.current.srcObject=stream;
            videoref.current.controls=true;
        }
        pc.addTrack(stream.getVideoTracks()[0],stream)
        pc.addTrack(stream.getAudioTracks()[0],stream)
        }catch(err){
            console.log(err)
        }
    }

    return <div>
        sender <button onClick={createconnection} >  send video</button>
        <video ref={videoref} autoPlay  ></video>
    </div>
}