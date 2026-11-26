<?php get_header();
$logo = get_template_directory_uri().'/assets/logo.png';
$shop = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('shop') : '#';
$slides = [
  [
    'FUEL THE <em>BEAST</em> IN YOU',
    '100% Genuine whey protein, mass gainers & creatine direct from authorised brands.',
    'https://images.unsplash.com/photo-1579722820308-d74e571900a9?auto=format&fit=crop&w=600&q=80',
    'radial-gradient(circle at 75% 50%, #4a2c07 0%, #16130f 65%)'
  ],
  [
    'MAX GAINS <em>MEGA</em> SALE',
    'Up to 45% OFF on International & Indian Bestsellers + Extra 5% with PROTEIN5.',
    'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80',
    'radial-gradient(circle at 75% 50%, #173663 0%, #0d1726 65%)'
  ],
  [
    'VERIFY BEFORE YOU <em>LIFT</em>',
    'Zero fake supplements. Scratch the holographic code on your pack to authenticate online.',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    'radial-gradient(circle at 75% 50%, #174e2d 0%, #0b1a10 65%)'
  ]
];
$cats = function_exists('wc_get_page_id') ? get_terms(['taxonomy'=>'product_cat','parent'=>0,'hide_empty'=>false,'exclude'=>[get_option('default_product_cat')]]) : [];
?>
<main class="w">

<!-- Hero Carousel -->
<div class="hero">
  <?php foreach($slides as $i=>$s): ?>
  <div class="slide <?php echo $i===0?'on':''; ?>" style="background:<?php echo $s[3]; ?>;background-size:cover;background-position:center;">
    <div>
      <span style="display:inline-block;background:var(--or);color:#120f0c;font:800 11px 'Barlow Condensed';letter-spacing:0.08em;padding:3px 8px;border-radius:4px;margin-bottom:10px;text-transform:uppercase">VERIFIED AUTHENTIC</span>
      <h1><?php echo wp_kses($s[0],['em'=>[]]); ?></h1>
      <p><?php echo esc_html($s[1]); ?></p>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <a class="sb" href="<?php echo esc_url($shop); ?>">Shop Now ›</a>
        <a class="sb" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:#fff" href="#help">Verify Authenticity</a>
      </div>
    </div>
    <div style="display:grid;place-items:center;height:240px">
      <img src="<?php echo esc_url($s[2]); ?>" alt="Supplement" style="max-height:220px;max-width:100%;object-fit:contain;filter:drop-shadow(0 14px 28px rgba(0,0,0,0.6))">
    </div>
  </div>
  <?php endforeach; ?>
  <div class="dots"><?php foreach($slides as $i=>$s) echo '<i class="'.($i===0?'on':'').'"></i>'; ?></div>
</div>

<!-- Trust & Perks Bar -->
<div class="sec" style="margin:20px 0 28px">
  <div class="usp">
    <div><i>🛡️</i>100% Brand Authorised<span>Direct from verified brand partners</span></div>
    <div><i>🔬</i>Lab Tested Certified<span>Scratch code on every single pack</span></div>
    <div><i>🚚</i>Free Express Delivery<span>Complimentary shipping on ₹499+</span></div>
    <div><i>💳</i>Safe & Instant Pay<span>UPI, Cards and Cash on Delivery</span></div>
  </div>
</div>

<!-- Promo Banner Pills -->
<div class="pills">
  <a class="pill g" href="#help">
    <span style="font-size:30px">🛡️</span>
    <div>
      <div style="font-size:17px;line-height:1.2">Scratch & Authenticate Pack</div>
      <small style="font-weight:600;color:var(--mu);font-size:13.5px">Check purity certificate instantly</small>
    </div>
    <span style="margin-left:auto;font-size:24px">›</span>
  </a>
  <div class="pill o" data-copy="PROTEIN5">
    <span style="font-size:28px">🏷️</span>
    <div>
      <div style="font-size:17px;line-height:1.2">Flat 5% Off For New Customers</div>
      <small style="font-weight:600;color:var(--mu);font-size:13.5px">Tap to copy coupon code</small>
    </div>
    <code>PROTEIN5</code>
  </div>
</div>

<!-- Category Grids -->
<?php if($cats): ?>
<div class="sec">
  <div class="sh"><h2>Shop by category</h2><a href="<?php echo esc_url($shop); ?>">View All ›</a></div>
  <div class="ct">
    <?php foreach($cats as $t){
      $img=get_term_meta($t->term_id,'thumbnail_id',true);
      echo '<a class="c" href="'.esc_url(get_term_link($t)).'"><div class="ti">'.($img?wp_get_attachment_image($img,'woocommerce_thumbnail'):pe_pack($t->name,$t->name)).'</div><b>'.esc_html($t->name).'</b></a>';
    } ?>
  </div>
</div>

<?php foreach(array_slice($cats,0,3) as $t): ?>
<div class="sec">
  <div class="sh"><h2>Bestsellers in <?php echo esc_html($t->name); ?></h2><a href="<?php echo esc_url(get_term_link($t)); ?>">View All ›</a></div>
  <?php pe_row(['category'=>[$t->slug],'orderby'=>'popularity']); ?>
</div>
<?php endforeach; ?>
<?php endif; ?>

<!-- Unbeatable Deals -->
<div class="sec" id="deals">
  <div class="sh"><h2>⚡ Unbeatable Steal Deals</h2><span style="font-size:12px;color:var(--mu);font-weight:600">Stock Selling Fast</span></div>
  <?php if(function_exists('wc_get_product_ids_on_sale')&&wc_get_product_ids_on_sale()): ?>
    <?php pe_row(['include'=>wc_get_product_ids_on_sale(),'orderby'=>'date']); ?>
  <?php else: ?>
  <div class="deals">
    <div class="dl" onclick="location.href='<?php echo esc_url($shop); ?>'">
      <h3>Plant Protein Explosion</h3>
      <small>UP TO</small>
      <div class="dsp">28% OFF</div>
      <div style="text-align:right">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/ESN_ISO_Clear_-_Whey_Protein.jpg/640px-ESN_ISO_Clear_-_Whey_Protein.jpg" style="height:65px;object-fit:contain" alt="Plant Protein">
      </div>
    </div>
    <div class="dl" onclick="location.href='<?php echo esc_url($shop); ?>'">
      <h3>Raw Power Creatine</h3>
      <small>UP TO</small>
      <div class="dsp">35% OFF</div>
      <div style="text-align:right">
        <img src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80" style="height:65px;object-fit:contain" alt="Creatine">
      </div>
    </div>
    <div class="dl" onclick="location.href='<?php echo esc_url($shop); ?>'">
      <h3>Pre-Workout Insanity</h3>
      <small>UP TO</small>
      <div class="dsp">33% OFF</div>
      <div style="text-align:right">
        <img src="https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=600&q=80" style="height:65px;object-fit:contain" alt="Pre-Workout">
      </div>
    </div>
    <div class="dl" onclick="location.href='<?php echo esc_url($shop); ?>'">
      <h3>Daily Multivitamin Pack</h3>
      <small>UP TO</small>
      <div class="dsp">38% OFF</div>
      <div style="text-align:right">
        <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80" style="height:65px;object-fit:contain" alt="Vitamins">
      </div>
    </div>
  </div>
  <?php endif; ?>
</div>

<!-- Latest Launches -->
<div class="sec">
  <div class="sh"><h2>Discover the Latest Launches</h2></div>
  <?php pe_row(['orderby'=>'date','order'=>'DESC']); ?>
</div>

<!-- Athlete Testimonials -->
<div class="sec">
  <div class="sh"><h2>Tried, Tested, and Trusted by the Best</h2></div>
  <div class="rv">
    <div class="rc">
      <div class="av">🏋</div>
      <b>Yatharth Sharma</b>
      <u>National Powerlifter</u>
      Ordered Gold Whey 2kg. Package was vacuum sealed, code checked out on portal within seconds. Clean taste and zero bloating.
      <p style="margin-top:8px;color:var(--tx)">★★★★★ <b style="display:inline">5.0</b></p>
    </div>
    <div class="rc">
      <div class="av">🏋</div>
      <b>Arpit Verma</b>
      <u>Fitness Coach</u>
      Their Creatine 200 Mesh mixes like water. Super smooth delivery and 100% genuine lab certified batch. Worth every single rupee.
      <p style="margin-top:8px;color:var(--tx)">★★★★★ <b style="display:inline">5.0</b></p>
    </div>
    <div class="rc">
      <div class="av">🏋</div>
      <b>Chinmay Deshmukh</b>
      <u>CrossFit Athlete</u>
      I recommend Protein Emporium to all my gym clients. Knowing there are zero counterfeit products in circulation gives absolute peace of mind.
      <p style="margin-top:8px;color:var(--tx)">★★★★★ <b style="display:inline">5.0</b></p>
    </div>
    <div class="rc">
      <div class="av">🏋</div>
      <b>Vedant Patwardhan</b>
      <u>Marathon Runner</u>
      The EAAs + Electrolytes kept my hydration levels locked during my 21km half marathon run. Top quality supplements.
      <p style="margin-top:8px;color:var(--tx)">★★★★★ <b style="display:inline">5.0</b></p>
    </div>
    <div class="rc">
      <div class="av">🏋</div>
      <b>Siddharth Rawat</b>
      <u>Bodybuilder</u>
      The Mass Gainer helped me put on 4kg of solid mass during my bulk season. Easy on the stomach with authentic brand seals.
      <p style="margin-top:8px;color:var(--tx)">★★★★☆ <b style="display:inline">4.0</b></p>
    </div>
  </div>
</div>

<!-- Authenticate & Track & Help Center -->
<div class="sec" id="help">
  <div class="two">
    <div style="border:1.5px solid var(--bd);border-radius:16px;padding:28px;background:#fff">
      <h2 style="font-size:28px;font-family:'Barlow Condensed';font-weight:800;letter-spacing:0.02em">🛡️ Authenticate Your Product</h2>
      <p style="color:var(--mu);margin:8px 0 14px;font-size:15px">Scratch the holographic code on the pack and enter it here.</p>
      <input class="f" id="vc" placeholder="Scratch code (try PE-123456)">
      <button class="btn" id="verify-btn" type="button">Verify Certificate</button>
      <p id="vr" style="margin-top:12px"></p>

      <div style="margin-top:28px;padding-top:24px;border-top:1px solid var(--bd)">
        <h2 style="font-size:28px;font-family:'Barlow Condensed';font-weight:800;letter-spacing:0.02em">🚚 Track Your Order</h2>
        <input class="f" id="tid" placeholder="Order ID, e.g. PE-10234">
        <button class="btn" id="track-btn" type="button">Track Package</button>
        <p id="tr" style="margin-top:12px"></p>
      </div>
    </div>

    <div style="border:1.5px solid var(--bd);border-radius:16px;padding:28px;background:#fff">
      <h2 style="font-size:28px;font-family:'Barlow Condensed';font-weight:800;letter-spacing:0.02em">💬 Help Center & FAQs</h2>
      <details open>
        <summary>How do I know the product is genuine?</summary>
        <p>Every pack carries an official brand holographic scratch code. You can verify the purity batch certificate directly on this page.</p>
      </details>
      <details>
        <summary>What are the shipping charges?</summary>
        <p>Shipping is 100% FREE on all orders above ₹499, otherwise ₹49.</p>
      </details>
      <details>
        <summary>Can I return a product?</summary>
        <p>Sealed packs can be returned within 7 days. Opened supplements are non-returnable for hygiene reasons.</p>
      </details>
      <details>
        <summary>Which payments are accepted?</summary>
        <p>UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery.</p>
      </details>
    </div>
  </div>
</div>

<!-- About Section -->
<p class="about">
  <b style="color:var(--tx)"><?php bloginfo('name'); ?></b> is India's dedicated fitness and sports nutrition emporium. We stock whey protein, mass gainers, creatine, pre-workouts, BCAAs and vitamins from genuine brands at fair prices. Every pack can be verified with its scratch code so you always know what you are taking.
</p>

</main>
<?php get_footer();