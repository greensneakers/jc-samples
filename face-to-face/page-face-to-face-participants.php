<?php
/*
Template Name: Face to Face Participants
*/

get_header();

$args = array( 
	'post_type'	=> 'f2f_participant',
);
$the_query = new WP_Query( $args );
?>

<div id="main" class="grid clearfix">
	<div id="primary" class="c6-123456">

		<h1 class="page-title"><?php the_title(); ?></h1>
		<?php the_content(); ?>
	<div class="c4-1234 f2f-participant-loop clearfix">

		<? if ( $the_query->have_posts() ) : while ( $the_query->have_posts() ) : $the_query->the_post(); ?>
		<div class="c4-4 f2f-participant-preview">
			<a href="<?php the_permalink() ;?>">
				<div class="f2f-thumbnail">
					<? if ( has_post_thumbnail() ) { the_post_thumbnail( 'medium' ); } ?>
					<div class="f2f-participant-detail f2f-detail-text">
						<h3>Governor <?php the_field('face_to_face_participant_last_name');?></h3>
						<p><?php the_field('face_to_face_participant_state');?></p>
					</div>
				</div>
			</a>
		</div>
	<?php endwhile; else: ?><p>Sorry, there are no posts to display</p> <?php endif; ?>
	<?php wp_reset_query(); ?>

	</div>

	</div>
</div>

<?php get_footer(); ?>
