$(function(){
  'use strict';

  function loadKey(k){ try{ return JSON.parse(localStorage.getItem(k)||'[]'); }catch(e){ return []; } }
  function saveKey(k,v){ localStorage.setItem(k, JSON.stringify(v)); }

  function renderOrders(){
    var orders = loadKey('hightech_orders_v1');
    var $t = $('#orders-list'); $t.empty();
    if(!orders.length){ $t.append('<tr><td colspan="5">No orders yet.</td></tr>'); return; }
    orders.forEach(function(o){
      var $tr = $('<tr></tr>');
      $tr.append('<td>'+o.id+'</td>');
      $tr.append('<td>'+ (o.name||'') +'</td>');
      $tr.append('<td>'+ new Date(o.createdAt).toLocaleString() +'</td>');
      $tr.append('<td>$'+ (o.total||0).toFixed(2) +'</td>');
      var actions = '<button class="btn btn-sm btn-primary view-order" data-id="'+o.id+'">View</button> '
                  + '<button class="btn btn-sm btn-danger delete-order" data-id="'+o.id+'">Delete</button>';
      $tr.append('<td>'+actions+'</td>');
      $t.append($tr);
    });
  }

  function renderRepairs(){
    var items = loadKey('hightech_repairs_v1');
    var $t = $('#repairs-list'); $t.empty();
    if(!items.length){ $t.append('<tr><td colspan="6">No repair requests.</td></tr>'); return; }
    items.forEach(function(r){
      var $tr = $('<tr></tr>');
      $tr.append('<td>'+r.id+'</td>');
      $tr.append('<td>'+ (r.name||'') +'</td>');
      $tr.append('<td>'+ (r.phone||'') +'</td>');
      $tr.append('<td>'+ (r.pickup||'') +'</td>');
      $tr.append('<td>'+ (r.delivery||'') +'</td>');
      var actions = '<button class="btn btn-sm btn-primary view-repair" data-id="'+r.id+'">View</button> '
                  + '<button class="btn btn-sm btn-danger delete-repair" data-id="'+r.id+'">Delete</button>';
      $tr.append('<td>'+actions+'</td>');
      $t.append($tr);
    });
  }

  function renderAdmissions(){
    var items = loadKey('hightech_admissions_v1');
    var $t = $('#admissions-list'); $t.empty();
    if(!items.length){ $t.append('<tr><td colspan="6">No admissions yet.</td></tr>'); return; }
    items.forEach(function(a){
      var $tr = $('<tr></tr>');
      $tr.append('<td>'+a.id+'</td>');
      $tr.append('<td>'+ (a.name||'') +'</td>');
      $tr.append('<td>'+ (a.email||'') +'</td>');
      $tr.append('<td>'+ (a.phone||'') +'</td>');
      $tr.append('<td>'+ (a.course||'') +'</td>');
      var actions = '<button class="btn btn-sm btn-primary view-admission" data-id="'+a.id+'">View</button> '
                  + '<button class="btn btn-sm btn-danger delete-admission" data-id="'+a.id+'">Delete</button>';
      $tr.append('<td>'+actions+'</td>');
      $t.append($tr);
    });
  }

  // Actions
  $(document).on('click', '.view-order', function(){ var id = $(this).data('id'); window.open('receipt.html?id='+encodeURIComponent(id),'_blank'); });
  $(document).on('click', '.delete-order', function(){ if(!confirm('Delete this order?')) return; var id = $(this).data('id'); var list = loadKey('hightech_orders_v1').filter(function(o){return o.id!==id}); saveKey('hightech_orders_v1', list); renderOrders(); });

  $(document).on('click', '.view-repair', function(){ var id = $(this).data('id'); var items = loadKey('hightech_repairs_v1'); var r = items.find(function(x){return x.id===id}); if(!r){ alert('Not found'); return; } var w = window.open('','_blank'); var html = '<html><head><title>Repair '+r.id+'</title><link rel="stylesheet" href="css/bootstrap.min.css"></head><body style="padding:20px;">'; html += '<h3>Repair Request '+r.id+'</h3>'; html += '<div><strong>Name:</strong> '+(r.name||'')+'</div>'; html += '<div><strong>Phone:</strong> '+(r.phone||'')+'</div>'; html += '<div><strong>Pickup:</strong> '+(r.pickup||'')+'</div>'; html += '<div><strong>Delivery:</strong> '+(r.delivery||'')+'</div>'; html += '<div><strong>Description:</strong><p>'+(r.desc||'')+'</p></div>'; if(r.image) html += '<div><img src="'+r.image+'" style="max-width:400px;"/></div>'; html += '<div style="margin-top:20px;"><button onclick="window.print()" class="btn btn-primary">Print</button></div>'; html += '</body></html>'; w.document.write(html); w.document.close(); });
  $(document).on('click', '.delete-repair', function(){ if(!confirm('Delete this repair request?')) return; var id = $(this).data('id'); var list = loadKey('hightech_repairs_v1').filter(function(o){return o.id!==id}); saveKey('hightech_repairs_v1', list); renderRepairs(); });

  $(document).on('click', '.view-admission', function(){ var id = $(this).data('id'); var items = loadKey('hightech_admissions_v1'); var a = items.find(function(x){return x.id===id}); if(!a){ alert('Not found'); return; } var w = window.open('','_blank'); var html = '<html><head><title>Admission '+a.id+'</title><link rel="stylesheet" href="css/bootstrap.min.css"></head><body style="padding:20px;">'; html += '<h3>Admission '+a.id+'</h3>'; html += '<div><strong>Name:</strong> '+(a.name||'')+'</div>'; html += '<div><strong>Email:</strong> '+(a.email||'')+'</div>'; html += '<div><strong>Phone:</strong> '+(a.phone||'')+'</div>'; html += '<div><strong>Course:</strong> '+(a.course||'')+'</div>'; html += '<div style="margin-top:20px;"><button onclick="window.print()" class="btn btn-primary">Print</button></div>'; html += '</body></html>'; w.document.write(html); w.document.close(); });
  $(document).on('click', '.delete-admission', function(){ if(!confirm('Delete this admission?')) return; var id = $(this).data('id'); var list = loadKey('hightech_admissions_v1').filter(function(o){return o.id!==id}); saveKey('hightech_admissions_v1', list); renderAdmissions(); });

  // Initial render
  renderOrders(); renderRepairs(); renderAdmissions();
});
