const express = require('express');
const app = express();
app.get('/',(req,res) => {
  res.send('الخادم يعمل');  
});
let rolet = "admin";
const dater =["admin","cous"]; 
app.get('/tasks',(req , res )=>{
if (dater.includes(rolet)){
  res.json("admin welcome");
}
else{
  res.status(403).json("errore");
}; 
});

app.post('/tasks',(req , res )=>{
  const reqo = req.body;
  res.json({ message: "reqo" , task:reqo});


});
app.listen(3000,()=>{
    console.log('server is running on port 3000');
});