<?php

get_header();
?>

<div id="main" class="grid clearfix">
	<div id="primary" class="c6-123456 single-f2f">
		<h1 class="page-title"><?php the_title(); ?></h1>

		<?php if ( get_field('face_to_face_participant_blockquote' ) ) : ?>
				<blockquote><?php the_field('face_to_face_participant_blockquote');?></blockquote>
		<?php endif; ?>
		<?php the_date(); ?>
		<?php the_content(); ?>

		<p><a href="https://csgjusticecenter.org/nrrc/publications/face-to-face-connecting-policymakers-to-people-involved-with-the-correctional-system/">See other governors in action.</a></p>

		<div class="pagination pagination-single f2f-pagination">
			<span class="next"><?php next_post_link() ?></span>
			<span class="previous"><?php previous_post_link() ?></span>
		</div>

	</div>
</div>

<?php get_footer(); ?>
