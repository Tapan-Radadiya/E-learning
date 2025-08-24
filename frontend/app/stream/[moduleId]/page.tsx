'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function StreamVideo() {
    // Variabls

    const { moduleId } = useParams<{ moduleId: string }>()
    // Use States


    // Use Hooks


    // Use Refs


    // Use Effects


    // Functions


    return (
        <>
            <div className="max-w-2xl min-w-2xl w-2xl">
                <h1>{moduleId}</h1>
            </div>
            <video controls autoPlay>
                <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            </video>
        </>
    );
}