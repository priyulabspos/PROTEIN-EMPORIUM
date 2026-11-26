<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><?php wp_head(); ?></head>
<body <?php body_class(); ?>><?php wp_body_open();
$logo=get_template_directory_uri().'/assets/logo.png';
$acct=function_exists('wc_get_page_permalink')?wc_get_page_permalink('myaccount'):'#';
$cart=function_exists('wc_get_cart_url')?wc_get_cart_url():'#';
$count=(function_exists('WC')&&WC()->cart)?WC()->cart->get_cart_contents_count():0; ?>
<div class="top-bar">
  <span>⚡ MEGA SALE IS LIVE</span> • Extra 5% OFF with code <code>PROTEIN5</code> • Free Express Delivery on ₹499+
</div>
<header><div class="w hd">
<button class="hb sq" id="menu-open" aria-label="Menu"><svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
<a href="<?php echo esc_url(home_url('/')); ?>"><img class="logo" src="<?php echo esc_url($logo); ?>" alt="<?php bloginfo('name'); ?>"></a>
<button class="hb pin" id="pin-btn" aria-label="Delivery pincode"><svg viewBox="0 0 24 24"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg><span class="lb" id="pin-label">Add Pincode</span></button>
<form class="srch" role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>"><input type="search" name="s" placeholder='Search "whey protein"' value="<?php echo esc_attr(get_search_query()); ?>"><input type="hidden" name="post_type" value="product"></form>
<a class="hb" href="<?php echo esc_url($acct); ?>" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg><span class="lb"><?php echo is_user_logged_in()?'Dashboard':'Login'; ?></span></a>
<a class="hb" href="<?php echo esc_url(home_url('/admin-login.html')); ?>" aria-label="Admin" title="Admin Portal"><svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span class="lb">Admin</span></a>
<?php if(function_exists('yith_wcwl_get_wishlist_url')): ?><a class="hb" href="<?php echo esc_url(yith_wcwl_get_wishlist_url()); ?>" aria-label="Wishlist"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg><span class="lb">Wishlist</span></a><?php endif; ?>
<a class="hb" href="<?php echo esc_url($cart); ?>" aria-label="Cart"><svg viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4h11L21 7H6"/></svg><span class="lb">Cart</span><b class="cc"><?php echo (int)$count; ?></b></a>
</div></header>
<div class="side" id="sd"><button class="x" id="menu-close" aria-label="Close">×</button><h2 class="dsp" style="font-size:28px;margin:8px 0 12px">Menu</h2>
<?php if(function_exists('wc_get_page_id')) foreach(get_terms(['taxonomy'=>'product_cat','parent'=>0,'hide_empty'=>false,'exclude'=>[get_option('default_product_cat')]]) as $t) echo '<a href="'.esc_url(get_term_link($t)).'">'.esc_html($t->name).'</a>'; ?>
<a href="<?php echo esc_url(function_exists('wc_get_page_permalink')?wc_get_page_permalink('shop'):home_url('/')); ?>">All products</a><a href="<?php echo esc_url($acct); ?>">My orders</a></div>