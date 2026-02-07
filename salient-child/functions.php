<?php
/**
 * Look Serious — Salient Child Theme
 *
 * Functions and definitions for the Look Serious branded Salient child theme.
 * Enqueues Google Fonts (Syne + Outfit), custom CSS overrides, and branded JS.
 *
 * @package LookSerious
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Define theme version for cache busting.
 */
define( 'LS_THEME_VERSION', '1.0.0' );

/**
 * Enqueue parent + child styles, Google Fonts, and custom assets.
 */
add_action( 'wp_enqueue_scripts', 'look_serious_enqueue_styles', 100 );

function look_serious_enqueue_styles() {

    $theme_version = defined( 'LS_THEME_VERSION' ) ? LS_THEME_VERSION : '1.0.0';

    // Google Fonts — Syne (display) + Outfit (body)
    wp_enqueue_style(
        'look-serious-google-fonts',
        'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500&family=Syne:wght@500;600;700;800&display=swap',
        array(),
        null
    );

    // Child theme style.css (CSS custom properties / design tokens)
    wp_enqueue_style(
        'salient-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        array(),
        $theme_version
    );

    // Look Serious branding overrides
    wp_enqueue_style(
        'look-serious-branding',
        get_stylesheet_directory_uri() . '/assets/css/look-serious.css',
        array( 'salient-child-style' ),
        $theme_version
    );

    // RTL support
    if ( is_rtl() ) {
        wp_enqueue_style(
            'salient-rtl',
            get_template_directory_uri() . '/rtl.css',
            array(),
            '1',
            'screen'
        );
    }

    // Look Serious JavaScript (scroll reveal, rotating words, effects)
    wp_enqueue_script(
        'look-serious-js',
        get_stylesheet_directory_uri() . '/assets/js/look-serious.js',
        array(),
        $theme_version,
        true
    );
}

/**
 * Add preconnect hints for Google Fonts performance.
 */
add_action( 'wp_head', 'look_serious_preconnect', 1 );

function look_serious_preconnect() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
}

/**
 * Add Look Serious body classes for theme variant support.
 */
add_filter( 'body_class', 'look_serious_body_classes' );

function look_serious_body_classes( $classes ) {
    $classes[] = 'look-serious-theme';

    // Add light theme class for specific pages (e.g. About)
    if ( is_page( 'about' ) || is_page_template( 'template-about.php' ) ) {
        $classes[] = 'ls-theme-light';
    }

    return $classes;
}

/**
 * Register a custom nav menu location for the header CTA.
 */
add_action( 'after_setup_theme', 'look_serious_theme_setup' );

function look_serious_theme_setup() {
    // Register navigation menus
    register_nav_menus( array(
        'ls-primary'   => __( 'Look Serious Primary Menu', 'look-serious' ),
        'ls-footer'    => __( 'Look Serious Footer Menu', 'look-serious' ),
    ) );
}

/**
 * Custom footer output — replaces Salient's default footer with Look Serious branding.
 * Usage: Add to a Salient footer builder row or use via shortcode [look_serious_footer].
 */
add_shortcode( 'look_serious_footer', 'look_serious_footer_shortcode' );

function look_serious_footer_shortcode() {
    ob_start();
    ?>
    <div class="ls-footer">
        <div class="ls-footer-left">
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>">&copy;Look Serious</a>
        </div>
        <div class="ls-footer-right">
            <span class="ls-designer-credit">site designed by <a href="https://aaroncphelps.com" target="_blank" rel="noopener">AARON PHELPS</a></span>
            <div class="ls-designer-badge">
                <div class="ls-designer-badge-inner">
                    <span class="ls-badge-letter">A</span>
                </div>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Custom hero section shortcode.
 * Usage: [look_serious_hero headline="Brands are<br>systems." subline="Be the zebra." accent_text="Not logos."]
 */
add_shortcode( 'look_serious_hero', 'look_serious_hero_shortcode' );

function look_serious_hero_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'headline'     => 'Brands are systems.',
        'subline'      => '',
        'accent_text'  => '',
        'strikethrough' => 'false',
    ), $atts, 'look_serious_hero' );

    ob_start();
    ?>
    <div class="ls-hero">
        <div class="ls-hero-content">
            <h1 class="ls-hero-headline">
                <?php echo wp_kses_post( $atts['headline'] ); ?>
                <?php if ( ! empty( $atts['accent_text'] ) ) : ?>
                    <span class="ls-line">
                        <span class="ls-accent <?php echo $atts['strikethrough'] === 'true' ? 'ls-strikethrough-wrap' : ''; ?>">
                            <?php echo esc_html( $atts['accent_text'] ); ?>
                        </span>
                    </span>
                <?php endif; ?>
            </h1>
            <?php if ( ! empty( $atts['subline'] ) ) : ?>
                <p class="ls-hero-subline"><?php echo wp_kses_post( $atts['subline'] ); ?></p>
            <?php endif; ?>
        </div>
        <div class="ls-scroll-indicator">
            <div class="ls-scroll-line"></div>
            <span class="ls-scroll-text">Scroll</span>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Custom CTA section shortcode.
 * Usage: [look_serious_cta tagline="..." headline="..." button_text="Let's Talk" email="aaron@look-serious.com"]
 */
add_shortcode( 'look_serious_cta', 'look_serious_cta_shortcode' );

function look_serious_cta_shortcode( $atts ) {
    $atts = shortcode_atts( array(
        'tagline'     => '',
        'headline'    => 'Your business has evolved. Let\'s see if we\'re the right fit.',
        'button_text' => "Let's Talk",
        'button_url'  => '',
        'email'       => 'aaron@look-serious.com',
        'note'        => '',
    ), $atts, 'look_serious_cta' );

    $button_url = ! empty( $atts['button_url'] )
        ? esc_url( $atts['button_url'] )
        : 'mailto:' . sanitize_email( $atts['email'] ) . '?subject=BOS%20Inquiry';

    ob_start();
    ?>
    <div class="ls-cta-section">
        <div class="ls-cta-content">
            <?php if ( ! empty( $atts['tagline'] ) ) : ?>
                <p class="ls-cta-tagline ls-fade-in"><?php echo wp_kses_post( $atts['tagline'] ); ?></p>
            <?php endif; ?>
            <p class="ls-cta-headline ls-reveal"><?php echo wp_kses_post( $atts['headline'] ); ?></p>
            <a href="<?php echo esc_url( $button_url ); ?>" class="ls-cta-button ls-glow-button ls-reveal"><?php echo esc_html( $atts['button_text'] ); ?></a>
            <?php if ( ! empty( $atts['email'] ) ) : ?>
                <p class="ls-cta-email ls-fade-in">or email directly: <a href="mailto:<?php echo sanitize_email( $atts['email'] ); ?>"><?php echo sanitize_email( $atts['email'] ); ?></a></p>
            <?php endif; ?>
            <?php if ( ! empty( $atts['note'] ) ) : ?>
                <p class="ls-cta-note ls-fade-in"><?php echo wp_kses_post( $atts['note'] ); ?></p>
            <?php endif; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

/**
 * Section divider shortcode.
 * Usage: [look_serious_divider]
 */
add_shortcode( 'look_serious_divider', 'look_serious_divider_shortcode' );

function look_serious_divider_shortcode() {
    return '<div class="ls-section-divider"></div>';
}

/**
 * Disable Salient's default Google Fonts loading (we load our own).
 * This prevents font conflicts and reduces page weight.
 */
add_action( 'wp_enqueue_scripts', 'look_serious_dequeue_salient_fonts', 999 );

function look_serious_dequeue_salient_fonts() {
    wp_dequeue_style( 'nectar-google-fonts' );
    wp_deregister_style( 'nectar-google-fonts' );
}

/**
 * Add theme support for editor styles (Gutenberg).
 */
add_action( 'after_setup_theme', 'look_serious_editor_setup', 20 );

function look_serious_editor_setup() {
    add_theme_support( 'editor-styles' );
    add_editor_style( 'assets/css/look-serious.css' );

    // Custom editor color palette matching Look Serious branding
    add_theme_support( 'editor-color-palette', array(
        array(
            'name'  => __( 'LS Black', 'look-serious' ),
            'slug'  => 'ls-black',
            'color' => '#050505',
        ),
        array(
            'name'  => __( 'LS Charcoal', 'look-serious' ),
            'slug'  => 'ls-charcoal',
            'color' => '#0e0e0e',
        ),
        array(
            'name'  => __( 'LS Dark Gray', 'look-serious' ),
            'slug'  => 'ls-dark-gray',
            'color' => '#161616',
        ),
        array(
            'name'  => __( 'LS Accent', 'look-serious' ),
            'slug'  => 'ls-accent',
            'color' => '#e04a2f',
        ),
        array(
            'name'  => __( 'LS Off White', 'look-serious' ),
            'slug'  => 'ls-off-white',
            'color' => '#f0f0f0',
        ),
        array(
            'name'  => __( 'LS White', 'look-serious' ),
            'slug'  => 'ls-white',
            'color' => '#ffffff',
        ),
    ) );
}
