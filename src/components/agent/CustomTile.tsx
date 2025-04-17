import React from 'react'
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

const CustomTile = () => {
  return (
    <div>
        <div>
            <Plus/>
            <Button> Custom </Button>
        </div>
        <div>
            <h1> Custom Starter</h1>
            <p>A completely empty agent with basic configuration, designed for creating your unique assistant.</p>
            
        </div>
    </div>
  )
}

export default CustomTile