'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function StreamVideo() {
    // Variabls
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhcGFucmFkYWRpeWEzMUBnbWFpbC5jb20iLCJpZCI6ImNkZDk3ZmE3LTRkOGEtNGY2ZC04ZmE3LWMzYzRmMTMyYTIxNyIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NjA1MjcxNCwiZXhwIjoxNzU2MDUzNjE0fQ.cxA1kBkuToGC49-lO1fhGJqCcfoSBuScIJi6K_BUymk`
    const { moduleId } = useParams<{ moduleId: string }>()
    const [videoUrl, setVideoUrl] = useState<string>('')
    // Use States


    // Use Hooks


    // Use Refs


    // Use Effects
    useEffect(() => {
        fetchModuleData()
    }, [])

    // Functions
    const fetchModuleData = async () => {
        const response = await axios.get(`http://localhost:3001/course-module/get-module-details/${moduleId}`, {
            responseType: 'blob',
            headers: {
                Range: 'bytes=0-', // Important for chunked response
            }
        })
        if (response.status === 206) {
            console.log("Video Will Be Streamed Live From Backend")
            const blobData = new Blob([response.data], { type: "video/mp4" })
            const videoUrl = URL.createObjectURL(blobData)
            console.log('videoUrl-->', videoUrl);
            setVideoUrl(videoUrl)

        }
        if (response.status === 200) {
            setVideoUrl(`https://.cloudfront.net/${response.data.data.video_url}`)
        }
    }

    return (
        <>
            <div className="max-w-2xl min-w-2xl w-2xl">
                <h1>{moduleId}</h1>
            </div>
            {
                videoUrl != "" &&
                <video controls autoPlay>
                    <source src={videoUrl} type="video/mp4" />
                </video>
            }
        </>
    );
}