const {Sequelize}=require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

sequelize.authenticate().then(()=>{
  console.log("data baseconnected");
  
}).catch((err)=>{
  console.log(err);
  
})

module.exports=sequelize;