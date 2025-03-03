<script lang="ts">
	import FlipCard from "$lib/components/common/FlipCard.svelte";
	import RotatingJupiter from "$lib/components/RotatingEarth.svelte";
	import SupabaseStorageFileUploader from "$lib/components/common/SupabaseStorageFileUploader.svelte";
	import { toasts } from "$lib/stores/toastStore";
	import { authService } from "$lib/services/authService";
	import { onMount } from "svelte";
	import Card from "./Card.svelte";
	// JavaScript logic can be added here if needed
	function imageSaved(path: string) {
		// console.log(path);
		toasts.success("Image saved", 3000);
	};
	let testGrid = $state('page-grid-1');
	onMount(() => {
		authService.login('marcus@v-sys.co.nz', 'abc1234');
	});

	//     background-image: url('https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg');
</script>

{#snippet frontPage()}
	<style>
		.front-page {

			padding: 1rem;
			border: 1px solid #ccc;
			border-radius: 0.5rem;
		}
	</style>
	<div class="front-page">
		<h1>Upload Image is on the back page</h1>
		<p>
			This is the front page of the card. It contains the main information about the card.
		</p>
	</div>
{/snippet}

{#snippet backPage()}
	<div>
		<div class="ribbon">Back</div>
		<p>
			This is the back page of the card. It contains more information about the card.
		</p>

	</div>
	<SupabaseStorageFileUploader bucketName="images" {imageSaved} />
{/snippet}

{#snippet loginStatus()}
	<style>
		.login-status {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			gap: 3rem;
		}
	</style>
	<div class="login-status">
		<p>Login Status: </p><h1> {!authService.getCurrentUser() ? 'Logged out' : 'Logged in'}</h1>
	</div>
{/snippet}

{@render loginStatus()}

<div class="text-container">
	<div class="card-container">
		<FlipCard frontPage={frontPage} backPage={backPage} />
	</div>

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
				within the main content.  so ithe there is more, does the box get bigger?
				<div class="box"><b></b></div>
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
		<a href="/star-trek" aria-label="Star Trek">
			<div class="wee-block">Star Trek</div>
		</a>
		<div class="wee-block"></div>
	</div>
</div>

<div class="jupiter-container">
	<RotatingJupiter />
</div>

<div class="image-container">
	<div class="ribbon">Resume</div>
	<img src="/images/marcus.jpg" alt="Marcus" />
</div>

		<select bind:value={testGrid}>
			<option value="page-grid-1">Page Grid 1</option>
			<option value="page-grid-2">Page Grid 2</option>
			<option value="page-grid-3">Page Grid 3</option>
			<option value="page-grid-4">Page Grid 4</option>
		</select>
<div class={testGrid}>
	<div class="header">Header
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
	</div>
	<div class="aside">Aside
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
	
	</div>
	<div class="main">Main
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
	
	</div>
	<div class="footer">Footer
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		Lorem ipsum dolor sit amet, con7
		sectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
		lorum ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
	
	</div>
</div>

<Card />
<style>

	.page-grid-1 {
		display: grid;
		grid-template-areas: 
		"a a a a a a a a a a a a a"
		"b b b b c c c c c c c c c"
		"b b b b d d d d d d d d d";
		width: calc(100vw - 3rem);
		height: 400px;
		background-color: black;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		margin: 1rem;
		overflow: auto;
	}
	.page-grid-2 {
		display: grid;
		grid-template-areas: 
		"a a a a a a a a a a a a a"
		"c c c c c c c c c c c b b"
		"d d d d d d d d d d d b b";
		width: calc(100vw - 3rem);
		height: 400px;
		background-color: black;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		margin: 1rem;
		overflow: auto;
	}	
	.page-grid-3 {
		display: grid;
		grid-template-areas: 
		"a a a a b b b c c d d d d"
		"a a a a b b b c c d d d d"
		"a a a a b b b c c d d d d";
		width: calc(100vw - 3rem);
		height: 400px;
		background-color: black;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		margin: 1rem;
		overflow: auto;
	}
	.page-grid-4 {
		display: grid;
		grid-template-areas: 
		"a a a a a a a a a a a a a"
		"b b b b b b b b b b b b b"
		"b b b b b b b b b b b b b"
		"b b b b b b b b b b b b b"
		"b b b b b b b b b b b b b"
		"c d d d d d d d d d d d d";
		width: calc(100vw - 3rem);
		height: 400px;
		background-color: black;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		margin: 1rem;
		overflow: auto;
	}
	.header {
		grid-area: a;
		width: 100%;
		background-color: red;
		padding: 1rem;
	}
	.main {
		grid-area: c;
		width: 100%;
		max-height: 200px;
		background-color: blue;
		padding: 1rem;
		overflow-y: auto;
		overflow-x: hidden;
	}
	.aside {
		grid-area: b;
		width: 100%;
		background-color: green;
		padding: 1rem;
	}
	.footer {
		grid-area: d;
		width: 100%;
		background-color: yellow;
		color: black;
		padding: 1rem;
	}
	

	/* HTML: <div class="ribbon">Your text content</div> */

	h1 {
		text-align: center;
		color: yellow;
		font-size: 2rem;
	}
	.card-container {
		width: 300px;
		height: 200px;
		margin: 0 1rem;
	}
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
		margin-block-start: 1rem;
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
		width: 180px;
		height: 300px;
		position: relative;
		box-shadow: inset 0 0 20px #155;
		border-radius: 0.5rem;
		border: 1px solid #111;
		overflow: hidden;
		margin-block-start: 1rem;
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
			left: 120px;
		}
	}
	@-moz-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 120px;
		}
	}
	@-o-keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 120px;
		}
	}
	@keyframes moveX {
		from {
			left: 0;
		}
		to {
			left: 120px;
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

	/* HTML: <div class="ribbon">Your text content</div> */
	.ribbon {
  font-size: 28px;
  font-weight: bold;
  color: #fff;
}
.ribbon {
  --f: .5em; /* control the folded part */
  
  position: absolute;
  top: 0;
  left: 0;
  line-height: 1.8;
  padding-inline: 1lh;
  padding-bottom: var(--f);
  border-image: conic-gradient(#0008 0 0) 51%/var(--f);
  clip-path: polygon(
    100% calc(100% - var(--f)),100% 100%,calc(100% - var(--f)) calc(100% - var(--f)),var(--f) calc(100% - var(--f)), 0 100%,0 calc(100% - var(--f)),999px calc(100% - var(--f) - 999px),calc(100% - 999px) calc(100% - var(--f) - 999px));
  transform: translate(calc((cos(45deg) - 1)*100%), -100%) rotate(-45deg);
  transform-origin: 100% 100%;
  background-color: #F07818; /* the main color  */
}
.image-container {
	margin: 2rem;
	position: relative;
	display: inline-block;
	width: 244px;
	height: 244px;

}

img {
	display: block;
	max-width: 100%;
	height: auto;
	border-radius: 0.5rem;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
}
</style>

