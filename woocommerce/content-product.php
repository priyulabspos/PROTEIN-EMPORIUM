<?php defined('ABSPATH')||exit; global $product;
if(empty($product)||!$product->is_visible())return;
echo '<li '; wc_product_class('',$product); echo '>'; pe_card($product); echo '</li>';
