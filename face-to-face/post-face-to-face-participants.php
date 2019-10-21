<?

// Custom Post Type for Face to Face Participants
add_action('init', function() {
  $singular = 'Face to Face Participant';
  $plural = 'Face to Face Participants';
  register_post_type('f2f_participant', array(
    'public' => true,
    'labels' => array(
      'add_new'        => "Add New $singular",
      'add_new_item'   => "New $singular",
      'edit_item'      => "Edit $singular",
      'menu_name'      => "$plural",
      'name'           => "$plural",
      'name_admin_bar' => "$singular",
      'not_found'      => "No $plural Found",
      'show_ui'        => false,
      'singular_name'  => "$singular",
      'view_item'      => "View $singular"
    ),
    'supports' => array(
      'title',
      'thumbnail',
      'editor',
      'excerpt',
      'revisions'
    ),
    'rewrite' => array(
      'slug' => "nrrc/face-to-face-in-action",
      'with_front' => false
    ),
    'description' => "Information about people who participate in the Face to Face initiative.",
    'menu_icon' => 'dashicons-admin-page'
  ));
});
