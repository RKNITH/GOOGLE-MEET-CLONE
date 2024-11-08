"use client"
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const VideoMeeting = () => {
  const params= useParams();
  const roomID = params.roomId;
  const {data:session,status} = useSession();
  const router = useRouter();
  const containerRef = useRef(null) // ref for video container element
  const [zp,setZp]  = useState(null)
  const [isInMeeting,setIsInMeeting] = useState(false);


  useEffect(() =>{
    if(status === 'authenticated' && session?.user?.name && containerRef.current){
      joinMeeting(containerRef.current)
    }else{
      console.log('session is not authenticate .please login before use')
    }
  },[session,status])



  useEffect(() =>{
    return () =>{
      if(zp){
        zp.destroy()
      }
    }
  },[zp])



  const joinMeeting = async (element) => {
    // generate Kit Token
     const appID = Number(process.env.NEXT_PUBLIC_ZEGOAPP_ID);
     const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET;
     if(!appID && !serverSecret){
      throw new Error('please provide appId and secret key')
     }

     const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  session?.user?.id || Date.now().toString(),  session?.user?.name || 'Guest');

   
    // Create instance object from Kit Token.
     const zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
     setZp(zegoInstance)
     // start the call
     zegoInstance.joinRoom({
       container: element,
       sharedLinks: [
         {
           name: 'join via this link',
           url:`${window.location.origin}/video-meeting/${roomID}`
         },
       ],
       scenario: {
         mode: ZegoUIKitPrebuilt.GroupCall, 
       },
       showAudioVideoSettingsButton:true,
       showScreenSharingButton:true,
       showTurnOffRemoteCameraButton:true,
       showTurnOffRemoteMicrophoneButton:true,
       showRemoveUserButton:true,
       onJoinRoom:() =>{
        toast.success('Meeting joined succesfully')
        setIsInMeeting(true);
       },
       onLeaveRoom:() =>{
        endMeeting();
       },
     });
 };

 const endMeeting =() =>{
  if(zp){
    zp.destroy();
  }
  toast.success('Meeting end succesfully')
  setZp(null);
  setIsInMeeting(false)
  router.push('/')
 }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <div
        className={`flex-grow flex flex-col md:flex-row relative ${
          isInMeeting ? "h-screen" : ""
        }`}
      >
        <div
          ref={containerRef}
          className="video-container flex-grow"
          style={{ height: isInMeeting ? "100%" : "calc(100vh - 4rem)" }}
        ></div>
      </div>
      {!isInMeeting && (
        <div className="flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              Meeting Info
            </h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Participant - {session?.user?.name || "You"}
            </p>
            <Button
              onClick={endMeeting}
              className="w-full bg-red-500 hover:bg-red-200 text-white hover:text-black"
            >
              End Meeting
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-200 dark:bg-gray-700">
            <div className="text-center">
              <Image
                src="/images/videoQuality.jpg"
                alt="Feature 1"
                width={150}
                height={150}
                className="mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                HD Video Quality
              </h3>
               <p className='text-sm text-gray-600 dark:text-gray-300'>
                Experience crystal clear video calls
               </p>
            </div>
            <div className="text-center">
              <Image
                src="/images/screenShare.jpg"
                alt="Feature 1"
                width={150}
                height={150}
                className="mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                 Screen Sharing
              </h3>
               <p className='text-sm text-gray-600 dark:text-gray-300'>
                  Easily  share your screen with participant
               </p>
            </div>
            <div className="text-center">
              <Image
                src="/images/videoSecure.jpg"
                alt="Feature 1"
                width={150}
                height={150}
                className="mx-auto mb-2 rounded-full"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                 Secure Meetings
              </h3>
               <p className='text-sm text-gray-600 dark:text-gray-300'>
                   Your meetings are protected and private
               </p>
            </div>
           </div>
        </div>
      )}
    </div>
  );
}

export default VideoMeeting