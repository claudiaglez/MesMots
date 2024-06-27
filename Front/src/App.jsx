import './App.css'
import { DatePickerDemo } from './app/ui/DatePicker'
import { ProfileForm } from './app/ui/ProfileForm'
import { Button } from './components/ui/Button'
function App() {

  return (
    <>
    <div>
     <Button>Hello</Button>
     <ProfileForm></ProfileForm>
     <DatePickerDemo />
    </div>
    </>
  )
}

export default App
