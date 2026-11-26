<?php
if(!defined('ABSPATH'))exit;

// Real high-definition product photo placeholder shown when a WooCommerce product has no uploaded image
function pe_pack($cat, $name = ''){
  $cat_imgs = [
    'whey-protein' => 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80',
    'creatine'     => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    'pre-workout'  => 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    'aminos'       => 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=600&q=80',
    'l-carnitine'  => 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80',
    'gainers'      => 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Optimus_nutritiongold_standard_whey_protein_%282%29.jpg/640px-Optimus_nutritiongold_standard_whey_protein_%282%29.jpg',
    'vitamins'     => 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    'health-food'  => 'https://images.unsplash.com/photo-1587393855524-087f83d95bc9?auto=format&fit=crop&w=600&q=80'
  ];
  $slug = sanitize_title($cat);
  $img = $cat_imgs[$slug] ?? 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80';
  return '<img src="'.esc_url($img).'" alt="'.esc_attr($name ?: $cat).'" style="max-height:85%;max-width:85%;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,0.16))">';
}
