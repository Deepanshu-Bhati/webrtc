import { BrowserRouter ,Routes,Route} from "react-router-dom";
import { Receiver } from "./components/receiver";
import { Sender } from "./components/server";
 
export default function App(){
  return   <BrowserRouter>
  <Routes>
    <Route path="/sender" element={<Sender/>} /> 
    <Route path="/receiver" element={<Receiver/>} /> 

  </Routes>
  </BrowserRouter>
}