import { useEffect, useRef } from "react"

export function Receiver(){

    const videoref=useRef<HTMLVideoElement|null>(null)

    useEffect(()=>{
        let socket =new WebSocket('ws://localhost:3000')

        socket.onopen=()=>{
            socket.send(JSON.stringify({type:'receiver'}))
        }
        let pc:RTCPeerConnection|null; 
        socket.onmessage=async(event)=>{
            const message=JSON.parse(event.data);
            if(message.type==='createoffer'){
                pc=  new RTCPeerConnection();
                pc.onicecandidate=(event)=>{
                    if(event.candidate){
                        socket.send(JSON.stringify({type:'icecandidate',candidate:event.candidate}))
                    }
                }

                pc.ontrack=(event)=>{
                    // console.log(track);
                    if(videoref.current){
                        videoref.current.srcObject=event.streams[0];
                        videoref.current.autoplay=true;
                        videoref.current.controls=true;
                    }

                }
                console.log(message);
                await pc?.setRemoteDescription(message.sdp);``
                const answer=await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({type:'createanswer',sdp:answer}))

            }else if(message.type==='icecandidate')
                if(pc!==null){
                // @ts-ignore
                console.log(message.candidate)
                pc.addIceCandidate(message.candidate);
                }
                
        }



    },[])

    return <div>
        name of 
        <video ref={videoref}></video>
    </div>
}