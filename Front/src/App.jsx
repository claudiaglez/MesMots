import React from 'react'
import './App.css'
import { Button } from './components/ui/Button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card"

function App() {

  return (
    <>
    <div>
     <Button>Hello</Button>
     <Card>
  <CardHeader>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Autor:</p>
    <p>Libro:</p>
  </CardFooter>
</Card>
    </div>
    </>
  )
}

export default App
