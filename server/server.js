/*===============Setup===============*/
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const {body, validationResult} = require('express-validator');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "",
    host: "localhost",
    password: "",
    database: ""
});
const transporter = nodemailer.createTransport({
    service: "",
    auth: {
      user: "", 
      pass: "", 
    },
  });
/*===================================*/



app.get("/api/datauser" ,(req,res)  => {
    db.query("SELECT * FROM user_information", (err , result) => {
        if (err) {
            console.log(err);
            res.send("error");
        } else {
            res.send(result);
        }
    }  ); 
    
})


app.post("/api/register" ,[
        body('name','Name is invalid\n').trim().notEmpty(),
        body('surname','Surname is invalid\n').trim().notEmpty(),
        body('mobile','Mobile Number is invalid\n').trim().notEmpty(),
        body("email",'Email is invalid\n').isEmail().custom( (value) => { 
            return new Promise((resolve , reject) => {db.query("SELECT email FROM user_information WHERE email = ?", [value] , 
            (err,result) => { 
                if (err) {
                    // console.log(err);
                    reject (new Error('Something has gone wrong\n'));
                } else {
                    if (result.length> 0) {
                        reject (new Error('This E-mail already in use\n'));
                    } else {
                        resolve(true);
                    }
                }
            } )} )

     } ),        

    ],(req,res) => {
            const validation_result = validationResult(req);
            if(validation_result.isEmpty()) {
                console.log(req.body);
                /*----------*/
                const name    = req.body.name;
                const surname = req.body.surname;
                const email   = req.body.email;
                const mobile  = req.body.mobile;
                const register_token = crypto.createHash('md5').update(name+surname+email+Date.now()).digest("hex")
                console.log("gen register_token :"+register_token);
                console.log(typeof register_token)
                /*----------*/
                db.query("INSERT INTO user_information (name,surname ,email,register_token) VALUES(?,?,?,?)",
                [name,surname ,email,register_token],
                (err , result) => {
                    if (err) {
                        console.log(err);
                        res.send("error");
                      } else {
                        // Send Mail
                        let mail_option = { from : "Dev-test <YOUR E-mail>",
                                            to : email,
                                            subject : "Please confirm your registration",
                                            html : `<h2>Thank you for  registration</h2><p>Please confirm your registration by clicking on the following link</p><a href=http://localhost:3001/api/verify/${register_token}> Click Here</a>`
                                          };
                        transporter.sendMail(mail_option , (err,result) =>{
                            if (err) {
                                console.log(err);
                                res.send("error");
                              } else {
                                console.log('Email sent: ' + result.response);
                                res.send("successes");
                              }
                        } )
                        
                      }
                    }
                  );
            }else {
                console.log(validation_result);
                let allErrors = validation_result.errors.map((error) => {
                    return error.msg;
                });
                console.log(allErrors);
                res.send(allErrors);
            }     

     });

app.get("/api/verify/:confirmationCode" ,(req,res) => {
        let confirmationCode = req.params.confirmationCode;
        db.query("SELECT verify FROM user_information WHERE register_token = ?", [confirmationCode],
            (err,result) => {
                if (err) {
                    console.log(err);
                    res.send(`<html><body><h1>Verification Status</h1><hr/><p>Something has gone wrong</p></body></html>`);
                } else {
                    console.log(result.length);
                    if (result.length > 0) {
                        // console.log(result[0].verify);
                        if (result[0].verify > 0) {
                            res.send(`<html><body><h1>Verification Status</h1><hr/><p>You have been verified</p></body></html>`);
                        } else {
                            db.query("UPDATE user_information SET verify = 1 WHERE register_token = ?",[confirmationCode], (err,result)=>{
                                if (err) {
                                    console.log(err);
                                    res.send(`<html><body><h1>Verification Status</h1><hr/><p>Something has gone wrong</p></body></html>`);
                                } else {
                                    res.send(`<html><body><h1>Verification Status</h1><hr/><p>verification success</p></body></html>`);
                                }
                            } );
                        }                        
                    } else {
                        res.send(`<html><body><h1>Verification Status</h1><hr/><p>Verification Code invalid or Something went wrong</p></body></html>`);
                    }
                }
            } );

    }
    );


app.listen(3001, () => {
    console.log('Server Listen on port 3001');
});

