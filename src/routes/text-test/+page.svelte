<script>
	// JavaScript logic can be added here if needed
</script>

<div class="text-container">
	<div class="about-info-container clearfix">
		<div>
			<p>
				This is the main content area where the text will wrap around the text block. Lorem ipsum
				dolor sit amet, malesuada fames ac turpis egestas. More content continues here, wrapping
				around the left-aligned block of text. Donec eleifend nulla nec libero gravida, ac bibendum
				nisiconsectetur adipiscing elit. Nulla facilisi. Sed non quam ut quam malesuada elementum.
				Nunc vel aliquet felis, eu vehicula ipsum. Quisque non magna orci. Nam bibendum est sit amet
				justo gravida.
			</p>
			<div class="about-info-block">
				This is a text block that floats within the main content. This is a text block that floats
				within the main content.
			</div>
			<p>
				In rutrum eros interdum. Pellentesque habitant morbi tristique senectus et netus et
				malesuada fames ac turpis egestas. More content continues here, wrapping around the
				left-aligned block of text. Donec eleifend nulla nec libero gravida, ac bibendum nisi
				accumsan. Suspendisse potenti. Etiam euismod volutpat odio, at vestibulum ante gravida ac.
				Curabitur dapibus libero id justo pharetra, eget porta justo scelerisque.
			</p>
			<p>
				In rutrum eros interdum. Pellentesque habitant morbi tristique senectus et netus et
				malesuada fames ac turpis egestas. More content continues here, wrapping around the
				left-aligned block of text. Donec eleifend nulla nec libero gravida, ac bibendum nisi
				accumsan. Suspendisse potenti. Etiam euismod volutpat odio, at vestibulum ante gravida ac.
				Curabitur dapibus libero id justo pharetra, eget porta justo scelerisque.
			</p>
		</div>
	</div>
	<div class="my-col">
		<a href="/resume">
			<div class="wee-block">home</div>
		</a>
		<a href="/resume" aria-label="resume">
			<div class="wee-block">resume</div>
		</a>
		<a href="/resume" aria-label="resume">
			<div class="wee-block"></div>
		</a>
		<div class="wee-block"></div>
	</div>
</div>

<div class="box"><b></b></div>

<style>
	.text-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
	}
	.about-info-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 70ch;
		min-width: 300px; /* Set a width for the container */
		margin: 0 1rem; /* Center the container */
	}
	.my-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.wee-block {
		width: 200px;
		height: 60px;
		background-color: greenyellow;
		border: 1px solid #ccc;
		margin: 0 15px 15px 0;
		color: black;
	}
	.about-info-block {
		float: left; /* Float the text block to the left */
		width: 200px; /* Width of the text block */
		background-color: #f0f0f0; /* Background color for visibility */
		padding: 10px; /* Padding around the text */
		border: 1px solid #ccc; /* Border for separation */
		margin: 0 15px 15px 0; /* Space between text block and main text */
		color: black;
	}

	/* Clearfix to ensure the container wraps floated children */
	.clearfix::after {
		content: '';
		display: table;
		clear: both;
	}
	p {
		margin-block: 0.7rem;
	}
	/* box ------------------------------------------------------------------------------- */
	.box {
		background-color: #006699;
		margin: 0 auto;
		width: 500px;
		height: 300px;
		position: relative;
		box-shadow: inset 0 0 20px #155;
		border-radius: 20px;
		border: 1px solid #111;
		overflow: hidden;
	}

	.box b {
		display: block;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: #999999;
		box-shadow:
			inset -5px -5px 5px rgba(0, 0, 0, 0.6),
			15px 15px 2px rgba(0, 0, 0, 0.04);
		background-image: url('/images/marcus.jpg');
		background-size: cover;
		background-position: center;
		position: absolute;
		-webkit-animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
		-moz-animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
		-o-animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
		animation:
			moveX 2s linear 0s infinite alternate,
			moveY 3.4s linear 0s infinite alternate;
	}

	@-webkit-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 440px;
		}
	}
	@-moz-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 440px;
		}
	}
	@-o-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 440px;
		}
	}
	@keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 440px;
		}
	}

	@-webkit-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 240px;
		}
	}
	@-moz-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 240px;
		}
	}
	@-o-keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 240px;
		}
	}
	@keyframes moveY {
		from {
			top: 0;
		}
		to {
			top: 240px;
		}
	}
</style>
