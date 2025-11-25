const API_BASE=(typeof window!=='undefined'&&window.API_BASE)?window.API_BASE:'/';
const s=document.getElementById('status');
const phone=document.getElementById('phone');
const code=document.getElementById('code');
const pass=document.getElementById('password');
const twofa=document.getElementById('twofa');
async function post(p,b){
  const r=await fetch(API_BASE+p,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
  return r.json();
}
document.getElementById('sendCode').onclick=async()=>{
  s.textContent='Отправка кода…';
  const res=await post('/api/send_code',{phone:phone.value.trim()});
  s.textContent=res.ok?'Код отправлен в Telegram':'Ошибка: '+(res.error||'');
};
document.getElementById('signIn').onclick=async()=>{
  s.textContent='Проверка кода…';
  const res=await post('/api/sign_in',{phone:phone.value.trim(),code:code.value.trim()});
  if(res.ok){
    s.textContent='Успешный вход: @'+(res.user.username||res.user.id);
  }else if(res.2fa_required){
    twofa.style.display='flex';
    s.textContent='Требуется пароль 2FA';
  }else{
    s.textContent='Ошибка: '+(res.error||'');
  }
};
document.getElementById('signIn2fa').onclick=async()=>{
  s.textContent='Вход по 2FA…';
  const res=await post('/api/sign_in_2fa',{phone:phone.value.trim(),password:pass.value});
  s.textContent=res.ok?'Успешный вход: @'+(res.user.username||res.user.id):'Ошибка: '+(res.error||'');
};
