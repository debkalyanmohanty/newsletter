const express = require('express');
const https = require('https');
const path = require('path');
const bodyParser = require('body-parser');
const { request } = require('http');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"/signup.html"));
});
app.post("/",(req,res)=>{
   const firstName = req.body.fname;
   const lastName = req.body.lname;
   const email = req.body.email;

   const data = {
    members : [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }

        }
    ]
   };
   const jsonData = JSON.stringify(data);

   const url = 'https://us13.api.mailchimp.com/3.0/lists/5c01e259a9';
   const options = {
    method:"POST",
    auth: "debkalyan:09ad7e5581059f6dc59e697653e83aad-us13"
   };

   const request = https.request(url,options,function(response){
    if(response.statusCode == 200){
        res.sendFile(path.join(__dirname,"/success.html"));
    }
    else {
        res.sendFile(path.join(__dirname,"/failure.html"));
    }
    response.on("data",()=>{
        console.log(JSON.parse(jsonData));
    });
    
   });

   request.end();


});
app.post("/failure",(req,res)=>{
    res.redirect("/");
})


app.listen(3000,()=>{
    console.log("Server Live At 3000");
});

