const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = process.env.DATA_DIR || __dirname;
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DATA_FILE = path.join(DATA_DIR, 'mathbot-data.json');
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

function loadDB(){
  if(!fs.existsSync(DATA_FILE)) return {nextUserId:1,nextWithdrawalId:1,users:[],withdrawals:[],audit:[]};
  try{return JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));}
  catch(err){console.error('Database read error:',err.message);process.exit(1);}
}
function saveDB(db){
  const tmp=DATA_FILE+'.tmp';
  fs.writeFileSync(tmp,JSON.stringify(db,null,2),'utf8');
  fs.renameSync(tmp,DATA_FILE);
}
let db=loadDB();
if(!db.nextUserId)db.nextUserId=(db.users?.reduce((m,u)=>Math.max(m,u.id),0)||0)+1;
if(!db.nextWithdrawalId)db.nextWithdrawalId=(db.withdrawals?.reduce((m,w)=>Math.max(m,w.id),0)||0)+1;
if(!Array.isArray(db.users))db.users=[];
if(!Array.isArray(db.withdrawals))db.withdrawals=[];
if(!Array.isArray(db.audit))db.audit=[];

if(!db.users.some(u=>u.username==='admin')){
  db.users.push({id:db.nextUserId++,username:'admin',passwordHash:bcrypt.hashSync(process.env.ADMIN_PASSWORD||'change-me-now',12),role:'admin',points:0,solved:0,correct:0,referrals:0,referralRewards:0,referralCode:'ADMIN',referredBy:null,joinedAt:new Date().toISOString()});
  saveDB(db);
}

app.use(helmet());
app.use(express.json({limit:'50kb'}));
app.use(express.urlencoded({extended:false}));
app.use(session({secret:SESSION_SECRET,resave:false,saveUninitialized:false,cookie:{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:7*24*60*60*1000}}));
app.get('/health',(req,res)=>res.json({ok:true,service:'mathbot-ph'}));
app.use(express.static(path.join(__dirname,'public')));

function userById(id){return db.users.find(u=>u.id===Number(id));}
function userByName(name){return db.users.find(u=>u.username===String(name||'').toLowerCase());}
function userByRef(code){return db.users.find(u=>u.referralCode===String(code||'').toUpperCase()&&u.role==='user');}
function safeUser(u){if(!u)return null;return {id:u.id,username:u.username,role:u.role,points:u.points,solved:u.solved,correct:u.correct,referral_code:u.referralCode,joined_at:u.joinedAt,referrals:u.referrals||0,referral_rewards:u.referralRewards||0};}
function audit(actorId,action,detail){db.audit.unshift({id:db.audit.length+1,actorId:actorId||null,action,detail:detail||'',createdAt:new Date().toISOString()});db.audit=db.audit.slice(0,200);saveDB(db);}
function auth(req,res,next){if(!req.session.userId)return res.status(401).json({error:'Login required'});const u=userById(req.session.userId);if(!u)return res.status(401).json({error:'Session expired'});req.user=u;next();}
function adminOnly(req,res,next){auth(req,res,()=>{if(req.user.role!=='admin')return res.status(403).json({error:'Admin only'});next();});}
function normalizeExpr(raw){return String(raw||'').replace(/[xX×]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/,/g,'').trim();}
function safeCalculate(raw){const s=normalizeExpr(raw);if(!/^[0-9+\-*/().%\s]+$/.test(s)||!/[+\-*/%]/.test(s))throw new Error('Unsupported expression');const result=Function('"use strict";return ('+s+')')();if(!Number.isFinite(result))throw new Error('Invalid calculation');return result;}

app.get('/api/me',(req,res)=>res.json({user:req.session.userId?safeUser(userById(req.session.userId)):null}));
app.post('/api/signup',(req,res)=>{
  const username=String(req.body.username||'').trim().toLowerCase();const password=String(req.body.password||'');const referralCode=String(req.body.referralCode||'').trim();
  if(!/^[a-z0-9_]{3,20}$/.test(username))return res.status(400).json({error:'Username must be 3–20 letters, numbers, or underscore.'});
  if(password.length<8)return res.status(400).json({error:'Password must be at least 8 characters.'});
  if(userByName(username))return res.status(409).json({error:'Username already exists.'});
  const ref=userByRef(referralCode);const id=db.nextUserId++;const u={id,username,passwordHash:bcrypt.hashSync(password,12),role:'user',points:ref?25:0,solved:0,correct:0,referrals:0,referralRewards:0,referralCode:'MB-'+crypto.randomBytes(4).toString('hex').toUpperCase(),referredBy:ref?ref.id:null,joinedAt:new Date().toISOString()};
  db.users.push(u);if(ref){ref.points+=100;ref.referrals=(ref.referrals||0)+1;ref.referralRewards=(ref.referralRewards||0)+100;}saveDB(db);req.session.userId=id;audit(id,'signup',`Created account ${username}${ref?' via '+ref.username:''}`);res.json({user:safeUser(u)});
});
app.post('/api/login',(req,res)=>{const username=String(req.body.username||'').trim().toLowerCase();const password=String(req.body.password||'');const u=userByName(username);if(!u||!bcrypt.compareSync(password,u.passwordHash))return res.status(401).json({error:'Invalid credentials'});req.session.userId=u.id;audit(u.id,'login','User logged in');res.json({user:safeUser(u)});});
app.post('/api/logout',(req,res)=>{const id=req.session.userId;if(id)audit(id,'logout','User logged out');req.session.destroy(()=>res.json({ok:true}));});
app.post('/api/solve',auth,(req,res)=>{const text=String(req.body.expression||'').trim();let result;try{result=safeCalculate(text);}catch(e){return res.status(400).json({error:e.message});}req.user.points+=10;req.user.solved+=1;req.user.correct+=1;saveDB(db);audit(req.user.id,'solve',`${text} = ${result}`);res.json({result,pointsAwarded:10,user:safeUser(req.user)});});
app.post('/api/withdraw',auth,(req,res)=>{const amount=Number(req.body.amount);const method=String(req.body.method||'').trim();const accountLabel=String(req.body.accountLabel||'').trim();if(!Number.isInteger(amount)||amount<1000)return res.status(400).json({error:'Minimum withdrawal is 1000 points'});if(!method||!accountLabel)return res.status(400).json({error:'Method and account label are required'});if(req.user.points<amount)return res.status(400).json({error:'Not enough points'});req.user.points-=amount;const w={id:db.nextWithdrawalId++,userId:req.user.id,amount,method,accountLabel,status:'pending',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};db.withdrawals.unshift(w);saveDB(db);audit(req.user.id,'withdrawal_request',`Withdrawal ${w.id}: ${amount} points`);res.json({ok:true,id:w.id,user:safeUser(req.user)});});
app.get('/api/withdrawals',auth,(req,res)=>res.json(db.withdrawals.filter(w=>w.userId===req.user.id).map(w=>({id:w.id,amount:w.amount,method:w.method,account_label:w.accountLabel,status:w.status,created_at:w.createdAt,updated_at:w.updatedAt}))));
app.get('/api/admin/overview',adminOnly,(req,res)=>{const users=db.users.filter(u=>u.role==='user').map(safeUser);const withdrawals=db.withdrawals.map(w=>{const u=userById(w.userId);return {id:w.id,amount:w.amount,method:w.method,account_label:w.accountLabel,status:w.status,created_at:w.createdAt,updated_at:w.updatedAt,username:u?.username||'unknown'};});const stats={users:users.length,totalPoints:users.reduce((n,u)=>n+u.points,0),pending:withdrawals.filter(w=>w.status==='pending').length,approved:withdrawals.filter(w=>w.status==='approved').length};res.json({stats,users,withdrawals});});
app.post('/api/admin/withdrawals/:id/approve',adminOnly,(req,res)=>{const w=db.withdrawals.find(x=>x.id===Number(req.params.id));if(!w||w.status!=='pending')return res.status(400).json({error:'Invalid withdrawal'});w.status='approved';w.updatedAt=new Date().toISOString();saveDB(db);audit(req.user.id,'approve_withdrawal',`Approved withdrawal ${w.id}`);res.json({ok:true});});
app.post('/api/admin/withdrawals/:id/reject',adminOnly,(req,res)=>{const w=db.withdrawals.find(x=>x.id===Number(req.params.id));if(!w||w.status!=='pending')return res.status(400).json({error:'Invalid withdrawal'});w.status='rejected';w.updatedAt=new Date().toISOString();const u=userById(w.userId);if(u)u.points+=w.amount;saveDB(db);audit(req.user.id,'reject_withdrawal',`Rejected withdrawal ${w.id}; returned ${w.amount} points`);res.json({ok:true});});
app.get('/api/admin/audit',adminOnly,(req,res)=>res.json(db.audit.map(a=>({id:a.id,action:a.action,detail:a.detail,created_at:a.createdAt,actor:(userById(a.actorId)?.username)||'system'}))));

app.listen(PORT,()=>console.log(`MathBot PH Phase 5 running on http://localhost:${PORT}`));
