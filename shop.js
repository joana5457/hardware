/* Simple client-side shop/cart implementation
   - Renders a small product list
   - Adds/removes/updates quantities
   - Persists cart in localStorage
   - Provides a checkout form that simulates order placement
*/

$(function(){
  'use strict';

  // Example product data. In a real app this would come from a server.
  var PRODUCTS = [
    {id: 'p1', title: 'Wireless Headphones', price: 59.99, img: 'images/pngwing.com (27).png'},
    {id: 'p2', title: 'Smart Watch', price: 89.99, img: 'images/pngwing.com (28).png'},
    {id: 'p3', title: 'Bluetooth Speaker', price: 39.99, img: 'images/pngwing.com (29).png'},
    {id: 'p4', title: 'USB-C Charger', price: 19.99, img: 'images/pngwing.com (30).png'},
     {id: 'p1', title: 'Wireless Headphones', price: 59.99, img: 'images/pngwing.com (31).png'},
    {id: 'p2', title: 'Smart Watch', price: 89.99, img: 'images/pngwing.com (32).png'},
    {id: 'p3', title: 'Bluetooth Speaker', price: 39.99, img: 'images/pngwing.com (33).png'},
    {id: 'p4', title: 'USB-C Charger', price: 19.99, img: 'images/pngwing.com (34).png'},
    {id: 'p1', title: 'Wireless Headphones', price: 59.99, img: 'images/pngwing.com (35).png'},
    {id: 'p2', title: 'Smart Watch', price: 89.99, img: 'images/pngwing.com (36).png'},
    {id: 'p3', title: 'Bluetooth Speaker', price: 39.99, img: 'images/pngwing.com (37).png'},
    {id: 'p4', title: 'USB-C Charger', price: 19.99, img: 'images/pngwing.com (38).png'},
     {id: 'p1', title: 'Wireless Headphones', price: 59.99, img: 'images/pngwing.com (39).png'},
    {id: 'p2', title: 'Smart Watch', price: 89.99, img: 'images/pngwing.com (40).png'},
    {id: 'p3', title: 'Bluetooth Speaker', price: 39.99, img: 'images/pngwing.com (41).png'},
    {id: 'p4', title: 'USB-C Charger', price: 19.99, img: 'images/pngwing.com (42).png'},
     {id: 'p1', title: 'Wireless Headphones', price: 59.99, img: 'images/pngwing.com (43).png'},
    {id: 'p2', title: 'Smart Watch', price: 89.99, img: 'images/pngwing.com (44).png'},
    {id: 'p3', title: 'Bluetooth Speaker', price: 39.99, img: 'images/pngwing.com (45).png'},
    {id: 'p4', title: 'USB-C Charger', price: 19.99, img: 'images/pngwing.com (46).png'}
  ];

  var CART_KEY = 'hightech_cart_v1';
  var ORDERS_KEY = 'hightech_orders_v1';

  function loadCart(){
    try{ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch(e){ return []; }
  }

  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

  function findInCart(cart, id){ return cart.find(function(i){ return i.id === id; }); }

  function renderProducts(){
    var $c = $('#products-container');
    $c.empty();
    PRODUCTS.forEach(function(p){
      var col = $('<div class="col-md-3"></div>');
      var card = $('<div class="we_box text_align_center" style="padding:20px;min-height:300px;"></div>');
      card.append('<img src="'+p.img+'" alt="'+p.title+'" style="max-height:150px;margin-bottom:15px;">');
      card.append('<h4>'+p.title+'</h4>');
      card.append('<p style="font-weight:bold;">$'+p.price.toFixed(2)+'</p>');
      var btn = $('<button class="read_more">Add to cart</button>');
      btn.on('click', function(){ addToCart(p.id); });
      card.append(btn);
      col.append(card);
      $c.append(col);
    });
  }

  function updateCartCount(){
    var cart = loadCart();
    var count = cart.reduce(function(s,i){ return s + (i.qty||0); },0);
    if(count>0){ $('#cart-count').text(count).show(); } else { $('#cart-count').hide(); }
  }

  function openCart(){ $('#cart-drawer').css('transform','translateX(0)'); renderCart(); }
  function closeCart(){ $('#cart-drawer').css('transform','translateX(100%)'); }

  function addToCart(id){
    var cart = loadCart();
    var item = findInCart(cart,id);
    if(item) item.qty = (item.qty||1)+1; else { var p = PRODUCTS.find(function(x){return x.id===id;}); cart.push({id:id,title:p.title,price:p.price,qty:1}); }
    saveCart(cart); updateCartCount(); openCart();
  }

  // Allow other pages (training) to add a priced item directly to the cart
  window.addPriceItemToCart = function(opts){
    // opts: {id, title, price, qty}
    if(!opts || !opts.id) return;
    var cart = loadCart();
    var item = findInCart(cart, opts.id);
    if(item) item.qty = (item.qty||0) + (opts.qty||1);
    else cart.push({ id: opts.id, title: opts.title||'Service', price: parseFloat(opts.price||0), qty: opts.qty||1 });
    saveCart(cart); updateCartCount(); openCart();
  };

  function renderCart(){
    var cart = loadCart();
    var $list = $('#cart-items'); $list.empty();
    if(cart.length===0){ $list.append('<p>Your cart is empty.</p>'); $('#cart-total').text('$0.00'); $('#select-all-cart').prop('checked', false); return; }
    cart.forEach(function(it){
      var row = $('<div class="cart-row" style="display:flex;gap:10px;align-items:center;margin-bottom:12px;border-bottom:1px solid #eee;padding-bottom:10px;"></div>');
      var chk = $('<input type="checkbox" class="cart-select" data-id="'+it.id+'" style="width:18px;height:18px;">');
      var info = $('<div style="flex:1;"></div>');
      info.append('<div style="font-weight:bold;">'+it.title+'</div>');
      info.append('<div>$'+it.price.toFixed(2)+'</div>');
      var controls = $('<div style="display:flex;gap:6px;align-items:center;"></div>');
      var dec = $('<button class="btn btn-sm">-</button>');
      var qty = $('<input type="number" min="1" value="'+it.qty+'" style="width:60px;padding:6px;text-align:center;">');
      var inc = $('<button class="btn btn-sm">+</button>');
      var rem = $('<button class="btn btn-sm" style="background:#ff4d4d;color:#fff;">Remove</button>');
      dec.on('click', function(){ changeQty(it.id, -1); });
      inc.on('click', function(){ changeQty(it.id, +1); });
      qty.on('change', function(){ var v = parseInt($(this).val())||1; setQty(it.id, v); });
      rem.on('click', function(){ removeItem(it.id); });
      controls.append(dec).append(qty).append(inc).append(rem);
      row.append(chk).append(info).append(controls);
      $list.append(row);
    });
    var total = cart.reduce(function(s,i){ return s + (i.qty||0)*i.price; },0);
    $('#cart-total').text('$'+total.toFixed(2));
  }

  function changeQty(id, delta){ var cart = loadCart(); var it = findInCart(cart,id); if(!it) return; it.qty = Math.max(1,(it.qty||1)+delta); saveCart(cart); renderCart(); updateCartCount(); }
  function setQty(id, qty){ var cart = loadCart(); var it = findInCart(cart,id); if(!it) return; it.qty = Math.max(1,qty); saveCart(cart); renderCart(); updateCartCount(); }
  function removeItem(id){ var cart = loadCart(); cart = cart.filter(function(i){ return i.id!==id; }); saveCart(cart); renderCart(); updateCartCount(); }

  // Checkout
  function beginCheckout(){ var cart = loadCart(); if(cart.length===0){ alert('Cart is empty'); return; } $('#checkout-modal').fadeIn(); }

  function formatCurrency(v){ return '$' + (v||0).toFixed(2); }

  function loadOrders(){
    try{ return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); }
    catch(e){ return []; }
  }

  function saveOrders(list){ localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); }

  function placeOrder(data){
    // Build order object and save to localStorage (simulate POS backend)
    var cart = loadCart();
    var total = cart.reduce(function(s,i){ return s + (i.qty||0)*i.price; },0);
    var order = {
      id: 'ORD' + Date.now().toString(36) + Math.floor(Math.random()*90+10).toString(36),
      name: data.name,
      phone: data.phone,
      address: data.address,
      cart: cart,
      total: total,
      createdAt: new Date().toISOString()
    };
    var orders = loadOrders(); orders.unshift(order); saveOrders(orders);

    // Clear cart and UI
    saveCart([]); updateCartCount(); renderCart(); closeCart(); $('#checkout-modal').fadeOut();

    // Redirect to receipt page to view/print
    var receiptUrl = 'receipt.html?id=' + encodeURIComponent(order.id);
    // open receipt in new window for POS workflow
    window.open(receiptUrl, '_blank');
    // Also notify user
    alert('Thank you, ' + order.name + '. Your order has been placed. Receipt will open in a new tab.');
  }

  // Events
  $(document).on('click', '#cart-toggle', function(e){ e.preventDefault(); openCart(); });
  $(document).on('click', '#close-cart', function(){ closeCart(); });
  $(document).on('click', '#checkout-btn', function(){ beginCheckout(); });
  $(document).on('click', '#select-all-cart', function(){ var checked = $(this).is(':checked'); $('.cart-select').prop('checked', checked); });
  $(document).on('click', '#remove-selected-btn', function(){
    var ids = $('.cart-select:checked').map(function(){ return $(this).data('id'); }).get();
    if(!ids.length){ alert('No items selected'); return; }
    if(!confirm('Remove selected items from cart?')) return;
    var cart = loadCart().filter(function(i){ return ids.indexOf(i.id) === -1; });
    saveCart(cart); renderCart(); updateCartCount();
  });
  $(document).on('click', '#checkout-selected-btn', function(){
    var ids = $('.cart-select:checked').map(function(){ return $(this).data('id'); }).get();
    if(!ids.length){ alert('No items selected'); return; }
    // build a temp cart containing only selected items and proceed to checkout flow
    var cart = loadCart();
    var selected = cart.filter(function(i){ return ids.indexOf(i.id) !== -1; });
    if(selected.length===0){ alert('No selected items found'); return; }
    // show a checkout modal prefilled with selected items; we'll reuse the existing checkout modal but attach selected cart
    $('#checkout-modal').data('selectedCart', selected).fadeIn();
  });
  $(document).on('click', '#cancel-checkout', function(){ $('#checkout-modal').fadeOut(); });

  $(document).on('submit', '#checkout-form', function(e){
    e.preventDefault();
    var selectedCart = $('#checkout-modal').data('selectedCart');
    var data = { name: $('#cust-name').val(), phone: $('#cust-phone').val(), address: $('#cust-address').val(), cart: selectedCart || loadCart() };
    if(!data.name || !data.phone || !data.address){ alert('Please fill all fields'); return; }
    placeOrder(data);
  });

  // Initialize
  renderProducts(); updateCartCount();
  // Check URL params to auto-add an item (portfolio -> shop fallback)
  try{
    var urlParams = new URLSearchParams(window.location.search);
    var addId = urlParams.get('add_id');
    var addTitle = urlParams.get('add_title');
    var addPrice = urlParams.get('add_price');
    if(addId && (addTitle || addPrice)){
      window.addPriceItemToCart({ id: addId, title: addTitle || addId, price: parseFloat(addPrice) || 0, qty:1 });
    }
  }catch(e){/* ignore */}
});
