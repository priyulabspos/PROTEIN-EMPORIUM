<?php
if(!defined('ABSPATH'))exit;
require_once get_template_directory().'/inc/pack.php';

add_action('after_setup_theme',function(){
  add_theme_support('woocommerce');add_theme_support('title-tag');add_theme_support('post-thumbnails');
  add_theme_support('wc-product-gallery-zoom');add_theme_support('wc-product-gallery-lightbox');add_theme_support('wc-product-gallery-slider');
  register_nav_menus(['footer'=>'Footer menu']);
});
add_action('wp_enqueue_scripts',function(){
  $v=wp_get_theme()->get('Version');
  wp_enqueue_style('pe-fonts','https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;500;600&display=swap',[],null);
  wp_enqueue_style('pe-style',get_stylesheet_uri(),[],$v);
  wp_enqueue_script('pe-js',get_template_directory_uri().'/assets/theme.js',[],$v,true);
});
// Wrap WooCommerce pages in our container
remove_action('woocommerce_before_main_content','woocommerce_output_content_wrapper',10);
remove_action('woocommerce_after_main_content','woocommerce_output_content_wrapper_end',10);
remove_action('woocommerce_sidebar','woocommerce_get_sidebar',10);
add_action('woocommerce_before_main_content',function(){echo '<main class="w">';});
add_action('woocommerce_after_main_content',function(){echo '</main>';});
// Live cart count in header
add_filter('woocommerce_add_to_cart_fragments',function($f){
  $f['b.cc']='<b class="cc">'.WC()->cart->get_cart_contents_count().'</b>';return $f;
});
// Free-shipping note and 4 columns
add_filter('loop_shop_columns',function(){return 4;});
function pe_card($p){
  if(!$p||!$p->is_visible())return;
  $ids=$p->get_category_ids();$term=$ids?get_term($ids[0]):null;
  $cat=$term?$term->name:'';
  $reg=(float)$p->get_regular_price();$sale=(float)$p->get_price();
  $off=($p->is_on_sale()&&$reg>0)?round((1-$sale/$reg)*100):0;
  $rate=$p->get_average_rating();$n=$p->get_review_count();
  echo '<div class="card"><div class="pi"><a href="'.esc_url($p->get_permalink()).'" style="display:grid;place-items:center;width:100%;height:100%">';
  if($off>=5)echo '<span class="bg">'.$off.'% OFF</span>';
  echo $p->get_image_id()?$p->get_image('woocommerce_thumbnail'):pe_pack($cat,$p->get_name());
  echo '</a>';
  if($p->is_purchasable()&&$p->is_in_stock()&&$p->is_type('simple'))
    echo '<a href="'.esc_url($p->add_to_cart_url()).'" data-quantity="1" data-product_id="'.$p->get_id().'" class="add button product_type_simple add_to_cart_button ajax_add_to_cart" aria-label="Add to cart">+</a>';
  echo '</div><div class="mt"><span style="color:#1d8a3a">●</span>'.($n?'<i>★ '.esc_html($rate).' ('.(int)$n.')</i>':'').'</div>';
  echo '<a class="nm" style="display:block" href="'.esc_url($p->get_permalink()).'">'.esc_html($p->get_name()).'</a>';
  echo '<div class="price">'.$p->get_price_html().'</div></div>';
}
function pe_row($args){
  $ps=wc_get_products($args+['status'=>'publish','limit'=>12]);
  if(!$ps)return;
  echo '<div class="row">';foreach($ps as $p)pe_card($p);echo '</div>';
}
