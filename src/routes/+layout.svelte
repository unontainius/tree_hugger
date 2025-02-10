<script lang="ts">
	import '../app.css';
	import Toast from '$lib/components/Toast.svelte';
	import { user } from '$lib/stores/authStore';
	import { authService } from '$lib/services/authService';
	import { onMount } from 'svelte';
	import { toasts } from '$lib/stores/toastStore';
	import { loginRequestedState } from '$lib/stores/authStore';
	import LoginForm from '$lib/components/LoginForm.svelte';
	import Window from '$lib/components/Window.svelte';
	import MIcon from '$lib/components/MIcon.svelte';
	import { browser } from '$app/environment';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import { menuName, menuConfigs } from '$lib/stores/menuStore';
	import { goto } from '$app/navigation';
	import { tick } from 'svelte';

	let LoggedIn = $state(false);

	$effect(() => {
		// This will run whenever $user changes
		LoggedIn = $user !== null;
	});

	let {data, children } = $props();
	let ShowLoginForm = $state(false);
	// let navIconSize = $state(browser ? (window.innerWidth > 768 ? 48 : 24) : 24);
	let navIconSize = 48;

	onMount(() => {
		authService.getCurrentUser();
	});

	async function handleLogout() {
		if ($user) {
			await authService.logout();
			loginRequestedState.update((state: boolean) => false);
		}
	}

	function toggleLogin() {
		ShowLoginForm = !ShowLoginForm;
	}

	async function handleMenuClick(item: MenuItem) {
		if (item.path === '/') {
			$menuName = 'home';
			await tick();
		}
		goto(item.path);
	}

</script>

	<Toast message="message not required other than to stop the compiler complaining" />


		<nav>
			{#each menuConfigs[$menuName].menuItems as item}
				{#if !item.requiresAuth || LoggedIn}
					<a class="nav-item" 
					href={item.path} 
					onclick={(e) => {
						e.preventDefault();
						handleMenuClick(item);
					}}>
						<MIcon name={item.icon} size={navIconSize} />
						<p>{item.name}</p>
					</a>
				{/if}
			{/each}

			<!-- Login/Logout always shown -->
			{#if LoggedIn}
				<button class="nav-item" onclick={handleLogout}>
					<MIcon name="logout" size={navIconSize} />
					<p>Logout</p>
				</button>
			{:else}
				<button class="nav-item" onclick={toggleLogin}>
					<MIcon name="login" size={navIconSize} />
					<p>Login</p>
				</button>
			{/if}
		</nav>
	
	{#if ShowLoginForm}
		<!-- showMinimize={false} showMaximize={false}  -->
		<Window
			title="Login"
			onClose={() => {
				ShowLoginForm = false;
			}}
			showMinimize={false}
			showMaximize={false}
			showFooter={false}
		>


			<LoginForm
				onclose={() => {
					ShowLoginForm = false;
				}}
			/>
		</Window>
	{/if}

	<PageTransition data={data}>
		{@render children()}
	</PageTransition>

	<div class="wave-container">
		<div class="wave"></div>

		<div class="wave"></div>
		<div class="wave"></div>
	</div>




<style>

	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		background-color: #013d55;
		color: white;
		width: 100vw;
	}
	:global(input), :global(select) {
		color: black;
	}

	nav {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: absolute;
		top: 0;
		width: calc(100vw - 1rem);
		padding: 2rem;
		padding-inline: 1rem;
		height: 4rem;
		z-index: 1000;
		background-color: #ffffff34;
		margin: 0.5rem;
		margin-block-start:0;
		border-radius: 1rem;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		/* outline: 1px solid rgba(255, 255, 255, 0.51);
		outline-offset: -4px; */


	}
	.nav-item {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap:0.5rem;
		flex-wrap: wrap;
		padding: 0.5rem;
		width:100%;
		box-shadow: none;
		border-radius: 0;
		border: none;
		background-color: transparent;
		color: rgba(255, 255, 255, 0.85);
	}
	.nav-item p {
		color: rgba(255, 255, 255, 0.377);
		font-size: 0.75rem;
		font-weight: thin;
	}
	.nav-item p:hover {
		color: rgba(251, 255, 0, 0.93);

	}

	.nav-item:hover {
		color: rgba(251, 255, 0, 0.93);
	}

@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

.wave {
    background: rgb(255 255 255 / 25%);
    border-radius: 1000% 1000% 0 0;
    position: fixed;
    width: 200%;
    height: 12em;
    animation: wave 10s -3s linear infinite;
    transform: translate3d(0, 0, 0);
    opacity: 0.8;
    bottom: 0;
    left: 0;
    z-index: -1;
}

.wave:nth-of-type(2) {
    bottom: -1.25em;
    animation: wave 18s linear reverse infinite;
    opacity: 0.8;
}

.wave:nth-of-type(3) {
    bottom: -2.5em;
    animation: wave 20s -1s reverse infinite;
    opacity: 0.9;
}

@keyframes wave {
    2% {
        transform: translateX(1);
    }

    25% {
        transform: translateX(-25%);
    }

    50% {
        transform: translateX(-50%);
    }

    75% {
        transform: translateX(-25%);
    }

    100% {
        transform: translateX(1);
    }
}

@media (max-width: 768px) {
	nav {
		gap:0.25rem
	}
	.nav-item p {
		display: none;
	}
	button {
		margin-inline:0.05rem;
	}
}


</style>
