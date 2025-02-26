"use client"
import React from 'react'
import { useStore } from '@/store/store'
const Counter = () => {
    const { mall,setMall } = useStore();
    return (
        <div>
            <h1>Mall Name:{mall}</h1>
            <input type="text" value={mall || ""} onChange={(e) => setMall(e.target.value)} />
        </div>
    )
}

export default Counter