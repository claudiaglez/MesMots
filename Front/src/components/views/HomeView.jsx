import React from 'react'
import { Button } from '../ui/Button'

const HomeView = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen space-y-12'>
    <div>
        <h1 className='text-8xl font-lifeSavers text-darkPink'>mes mots</h1>
    </div>
   <div className="flex justify-evenly space-x-4">
          <Button type="submit" variant="default">
            mes phrases
          </Button>
          <Button type="submit" variant="secondary">
            ajouter nouvelle phrase
          </Button>
        </div>
    </div>
  )
}

export default HomeView