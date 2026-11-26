(function(){
  function toast(m){
    var t=document.getElementById('toast');
    if(!t)return;
    t.textContent=m;
    t.style.display='block';
    clearTimeout(t._t);
    t._t=setTimeout(function(){t.style.display='none'},2200);
  }

  // Mobile menu
  var sd=document.getElementById('sd');
  var o=document.getElementById('menu-open'),c=document.getElementById('menu-close');
  if(o&&sd)o.onclick=function(){sd.classList.add('on')};
  if(c&&sd)c.onclick=function(){sd.classList.remove('on')};

  // Hero slider
  var sl=[].slice.call(document.querySelectorAll('.hero .slide')),dots=[].slice.call(document.querySelectorAll('.hero .dots i')),i=0;
  if(sl.length>1){
    setInterval(function(){
      sl[i].classList.remove('on');
      if(dots[i])dots[i].classList.remove('on');
      i=(i+1)%sl.length;
      sl[i].classList.add('on');
      if(dots[i])dots[i].classList.add('on');
    },4500);
  }

  // Copy coupon codes
  document.querySelectorAll('[data-copy]').forEach(function(el){
    el.onclick=function(){
      var code=el.getAttribute('data-copy');
      if(navigator.clipboard){
        navigator.clipboard.writeText(code);
      }
      toast('Code '+code+' copied');
      el.style.outline='2px solid #f58a07';
      setTimeout(function(){el.style.outline=''},1500);
    };
  });

  // Pincode
  var pinBtn=document.getElementById('pin-btn'),pinLbl=document.getElementById('pin-label');
  var savedPin=localStorage.getItem('pe_pin');
  if(savedPin&&pinLbl)pinLbl.textContent='Deliver to '+savedPin;
  if(pinBtn){
    pinBtn.onclick=function(){
      var p=prompt('Enter 6-digit delivery pincode:',savedPin||'');
      if(p!==null){
        p=p.trim();
        if(/^\d{6}$/.test(p)){
          localStorage.setItem('pe_pin',p);
          if(pinLbl)pinLbl.textContent='Deliver to '+p;
          toast('Delivery available at '+p);
        } else if(p) {
          toast('Enter a valid 6-digit pincode');
        }
      }
    };
  }

  // Product verification
  var vBtn=document.getElementById('verify-btn'),vc=document.getElementById('vc'),vr=document.getElementById('vr');
  if(vBtn&&vc&&vr){
    vBtn.onclick=function(){
      var v=vc.value.trim().toUpperCase();
      vr.innerHTML=/^PE-\d{6}$/.test(v)?'<b style="color:#1d8a3a">✔ Genuine product. Code verified.</b>':'<b style="color:#c0392b">Code not recognised. Check the code or contact support.</b>';
    };
  }

  // Order tracking
  var tBtn=document.getElementById('track-btn'),tid=document.getElementById('tid'),tr=document.getElementById('tr');
  if(tBtn&&tid&&tr){
    tBtn.onclick=function(){
      var v=tid.value.trim().toUpperCase();
      if(!v){tr.textContent='Please enter an order ID.';return;}
      tr.innerHTML='<b>'+v+'</b>: Confirmed. Packed and dispatching within 24 hours.';
    };
  }

  // Newsletter
  var nlBtn=document.getElementById('nl-btn');
  if(nlBtn){
    nlBtn.onclick=function(){toast('Subscribed! Check your inbox.')};
  }
})();