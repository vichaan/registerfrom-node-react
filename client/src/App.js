import axios from "axios";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function App() {

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [onChange , setonChange] = useState(false);

  const handleOnChange = (value) => {
    // console.log("Captcha value:", value);
    setonChange(true);
  }

  const addRegister = () => {
    axios.post('http://localhost:3001/api/register',{
      name : name,
      surname : surname,
      email : email,
      mobile : mobile
    }).then((res) => {
      // console.log(res.status);
      // console.log(res.data);
      // alert("Registered Successful");
      alert(res.data);
      window.location.reload();
    })
  }


  return (
    <div className="App container">
      <h1>Register</h1>
      <div className = "information">
        <from action="">
          <div className = "mb-3">
            <lable htmlFor="name" className = "form-label">
              Name :
            </lable>
          <input 
          type = "text"
          className = "form-control"
          placeholder = "Enter name"          
          onChange={(event)=>{
            setName(event.target.value)
          } }
          required/>
          </div>
          <div className = "mb-3">
            <lable htmlFor="Surname" className = "form-label">
            Surname :
            </lable>
          <input 
          type = "text"
          className = "form-control"
          placeholder = "Enter Surname"          
          onChange={(event)=>{
            setSurname(event.target.value)
          } }
          required/>
          </div>
          <div className = "mb-3">
            <lable htmlFor="Email" className = "form-label">
            Email :
            </lable>
          <input 
          type = "text"
          className = "form-control"
          placeholder = "Enter Email"          
          onChange={(event)=>{
            setEmail(event.target.value)
          } }
          required/>
          </div>
          <div className = "mb-3">
            <lable htmlFor="Mobile Number" className = "form-label">
            Mobile Number :
            </lable>
          <input 
          type = "text"
          className = "form-control"
          placeholder = "Enter Mobile Number"          
          onChange={(event)=>{
            setMobile(event.target.value)
          } }
          required/>
          </div>
 
          <ReCAPTCHA
          sitekey=""
          onChange={handleOnChange}
          />
          <button disabled = {!onChange} className = "btn btn-success" onClick= {addRegister}> Submit</button>
          

        </from>
      </div>



    </div>
  );
}

export default App;
