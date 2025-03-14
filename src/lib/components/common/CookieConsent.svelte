<script lang="ts">
	import { browser } from '$app/environment';

	// State for whether the banner should be shown
	let showBanner = $state(true);
	
	// Check if the user has already accepted cookies
	$effect(() => {
		if (browser) {
			const cookiesAccepted = localStorage.getItem('cookiesAccepted');
			if (cookiesAccepted === 'true') {
				showBanner = false;
			}
		}
	});

	// Function to accept cookies
	function acceptCookies() {
		if (browser) {
			localStorage.setItem('cookiesAccepted', 'true');
			showBanner = false;
		}
	}
	
	// Function to dismiss the banner without accepting
	function dismissBanner() {
		showBanner = false;
	}
</script>

{#if showBanner}
	<div class="cookie-banner" role="alert" aria-live="polite">
		<div class="cookie-content">
			<p>
				This website uses cookies to store authentication tokens for your login session and for that purpose only. 
				&nbsp;By continuing to use this site, you consent to our use of cookies for authentication purposes only.
			</p>
		</div>			
		<div class="cookie-actions">
			<button class="accept-button" onclick={acceptCookies}>Accept</button>
			<button class="dismiss-button" onclick={dismissBanner}>Dismiss</button>
		</div>
	</div>
{/if}

<style>
	.cookie-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(31, 41, 55, 0.95);
		color: white;
		padding: 1rem;
		z-index: 1000;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		letter-spacing: 0.05em;
	}

	.cookie-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.cookie-content {
			flex-direction: row;
			justify-content: space-between;
		}
	}

	p {
		margin: 0;
		line-height: 1.5;
	}

	.cookie-actions {
		display: flex;
		gap: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.accept-button {
		background-color: #3b82f6;
		color: white;
		border: none;
	}

	.accept-button:hover {
		background-color: #2563eb;
	}

	.dismiss-button {
		background-color: transparent;
		color: white;
		border: 1px solid white;
	}

	.dismiss-button:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style> 