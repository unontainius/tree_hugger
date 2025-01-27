<script lang="ts">
    export let name: string;
    export let size: string = '24px';
    export let color: string = 'currentColor';

    // Define a mapping of icon names to SVG paths
    const icons = {
        'add': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 7.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m1.5 3.5a3.5 3.5 0 1 0 0-7m-.357 16H3.857C2.831 20 2 19.233 2 18.286C2 15.919 4.079 14 6.643 14h3.714a4.9 4.9 0 0 1 2.786.857M19 14v6m3-3h-6" color="currentColor" />
                </svg>`,
        'add-image': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                            <path fill="currentColor" d="M22 6.75a.75.75 0 0 0 0-1.5zm-8-1.5a.75.75 0 0 0 0 1.5zM18.75 2a.75.75 0 0 0-1.5 0zm-1.5 8a.75.75 0 0 0 1.5 0zM22 5.25h-4v1.5h4zm-4 0h-4v1.5h4zM17.25 2v4h1.5V2zm0 4v4h1.5V6z" />
                            <path stroke="currentColor" d="M11.5 3C7.022 3 4.782 3 3.391 4.391S2 8.021 2 12.5c0 4.478 0 6.718 1.391 8.109S7.021 22 11.5 22c4.478 0 6.718 0 8.109-1.391S21 16.979 21 12.5V12" />
                            <path stroke="currentColor" d="M2 14.135q.93-.135 1.872-.132c2.652-.056 5.239.77 7.3 2.331c1.91 1.448 3.253 3.44 3.828 5.666" />
                            <path stroke="currentColor" d="M21 16.896c-1.175-.595-2.391-.897-3.614-.896c-1.851-.007-3.684.673-5.386 2" />
                        </g>
                    </svg>`,
        'add-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v8m4-4H8m14 0c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" color="currentColor" />
                        </svg>`,
        'edit': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.214 5.982l1.402-1.401a1.982 1.982 0 0 1 2.803 2.803l-1.401 1.402m-2.804-2.804L6.98 14.216c-1.045 1.046-1.568 1.568-1.924 2.205S4.342 18.561 4 20c1.438-.342 2.942-.7 3.579-1.056s1.16-.879 2.205-1.924l8.234-8.234m-2.804-2.804l2.804 2.804M11 20h6" color="currentColor" />
                </svg>`,
        'delete': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <path d="m19.5 5.5l-.62 10.025c-.158 2.561-.237 3.842-.88 4.763a4 4 0 0 1-1.2 1.128c-.957.584-2.24.584-4.806.584c-2.57 0-3.855 0-4.814-.585a4 4 0 0 1-1.2-1.13c-.642-.922-.72-2.205-.874-4.77L4.5 5.5" />
                        <path d="M9.5 12.5c.492-.506 1.8-2.5 2.5-2.5m2.5 2.5c-.492-.506-1.8-2.5-2.5-2.5m0 0v8M3 5.5h18m-4.945 0l-.682-1.408c-.454-.936-.68-1.403-1.071-1.695a2 2 0 0 0-.275-.172C13.594 2 13.074 2 12.034 2c-1.065 0-1.598 0-2.039.234a2 2 0 0 0-.278.18c-.396.303-.617.788-1.059 1.757L8.053 5.5" />
                    </g>
                </svg>`,
        'delete-image': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                                <path d="M21 12.5c0 4.478 0 6.718-1.391 8.109S15.979 22 11.5 22c-4.478 0-6.718 0-8.109-1.391S2 16.979 2 12.5c0-4.478 0-6.718 1.391-8.109S7.021 3 11.5 3" />
                                <path d="M2 14.135q.93-.135 1.872-.132c2.652-.056 5.239.77 7.3 2.331c1.91 1.448 3.253 3.44 3.828 5.666" />
                                <path d="M21 16.896c-1.175-.595-2.391-.897-3.614-.896c-1.851-.007-3.684.673-5.386 2m10-9l-3.5-3.5m0 0L15 2m3.5 3.5L22 2m-3.5 3.5L15 9" />
                            </g>
                        </svg>`,
        'save': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" />
                        <path d="m8 12.5l2.5 2.5L16 9" />
                    </g>
                </svg>`,
        'link': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m9.52 14.436l4.914-4.913m-1.865 5.586c.74 1.14.542 2.309-.313 3.164l-2.995 2.995a2.505 2.505 0 0 1-3.543 0l-2.986-2.986a2.505 2.505 0 0 1 0-3.543l2.995-2.996c.702-.702 2.036-1.107 3.183-.277m6.198 1.103c1.14.74 2.31.542 3.164-.312l2.995-2.996a2.505 2.505 0 0 0 0-3.543l-2.986-2.986a2.505 2.505 0 0 0-3.543 0l-2.995 2.995c-.702.702-1.107 2.036-.277 3.183" color="currentColor" />
                </svg>`,
        'download': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.478 9.011h.022c2.485 0 4.5 2.018 4.5 4.508c0 2.32-1.75 4.232-4 4.481m-.522-8.989q.021-.248.022-.5A5.505 5.505 0 0 0 12 3a5.505 5.505 0 0 0-5.48 5.032m10.958.98a5.5 5.5 0 0 1-1.235 3.005M6.52 8.032A5.006 5.006 0 0 0 2 13.018a5.01 5.01 0 0 0 4 4.91m.52-9.896q.237-.023.48-.023c1.126 0 2.165.373 3 1.002M12 21v-8m0 8c-.7 0-2.008-1.994-2.5-2.5M12 21c.7 0 2.008-1.994 2.5-2.5" color="currentColor" />
                    </svg>`,
        'search': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14 14l2.5 2.5m-.067 2.025a1.48 1.48 0 1 1 2.092-2.092l3.042 3.042a1.48 1.48 0 1 1-2.092 2.092zM16 9A7 7 0 1 0 2 9a7 7 0 0 0 14 0" color="currentColor" />
                    </svg>`,
        'delete-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14 14l2.5 2.5m-.067 2.025a1.48 1.48 0 1 1 2.092-2.092l3.042 3.042a1.48 1.48 0 1 1-2.092 2.092zM16 9A7 7 0 1 0 2 9a7 7 0 0 0 14 0" color="currentColor" />
                        </svg>`,
        'menu': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5h16M4 12h16M4 19h16" color="currentColor" />
                </svg>`,
        'menu-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.996 12h.009m-.021 4h.01M12 8h.009M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12s4.477 10 10 10s10-4.477 10-10" color="currentColor" />
                        </svg>`,
        'menu-dots': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0m0 7.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0m0 7.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0" color="currentColor" />
                        </svg>`,
        'close': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m15.75 15l-6-6m0 6l6-6m7 3c0-5.523-4.477-10-10-10s-10 4.477-10 10s4.477 10 10 10s10-4.477 10-10" color="currentColor" />
                </svg>`,
        'x': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 5L5 19M5 5l14 14" color="currentColor" />
            </svg>`,
        'fat-x': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.247 6.74c.826.827 1.24 1.24 1.753 1.24c.514 0 .927-.413 1.753-1.24h0l1.754-1.753h0c.407-.408.611-.612.823-.734c1.066-.616 1.945-.005 2.683.734c.739.738 1.35 1.617.734 2.683c-.122.212-.326.416-.734.823l-1.753 1.754c-.827.826-1.24 1.24-1.24 1.753c0 .514.413.927 1.24 1.753l1.753 1.754c.408.407.612.611.734.823c.616 1.066.005 1.945-.734 2.683c-.738.739-1.617 1.35-2.683.734c-.212-.122-.416-.326-.823-.734l-1.754-1.753h0c-.826-.826-1.24-1.24-1.753-1.24c-.514 0-.927.414-1.753 1.24h0l-1.754 1.753c-.407.408-.611.612-.823.734c-1.066.616-1.945.005-2.683-.734c-.739-.738-1.35-1.617-.734-2.683c.122-.212.326-.416.734-.823l1.753-1.754c.827-.826 1.24-1.24 1.24-1.753c0-.514-.414-.927-1.24-1.753L4.987 8.493c-.408-.407-.612-.611-.734-.823c-.616-1.066-.005-1.945.734-2.683c.738-.739 1.617-1.35 2.683-.734c.212.122.416.326.823.734h0z" color="currentColor" />
        </svg>`,
        'sad': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 17a5 5 0 0 1 4-2c1.636 0 3.088.786 4 2M8.009 9H8m8 0h-.009" />
                    </g>
                </svg>`,
        'star': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m13.728 3.444l1.76 3.549c.24.494.88.968 1.42 1.058l3.189.535c2.04.343 2.52 1.835 1.05 3.307l-2.48 2.5c-.42.423-.65 1.24-.52 1.825l.71 3.095c.56 2.45-.73 3.397-2.88 2.117l-2.99-1.785c-.54-.322-1.43-.322-1.98 0L8.019 21.43c-2.14 1.28-3.44.322-2.88-2.117l.71-3.095c.13-.585-.1-1.402-.52-1.825l-2.48-2.5C1.39 10.42 1.86 8.929 3.899 8.586l3.19-.535c.53-.09 1.17-.564 1.41-1.058l1.76-3.549c.96-1.925 2.52-1.925 3.47 0" color="currentColor" />
                </svg>`,
        'open-file': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 6.5h9.75c2.107 0 3.16 0 3.917.506a3 3 0 0 1 .827.827C22 8.59 22 9.393 22 11.5m-10-5l-.633-1.267c-.525-1.05-1.005-2.106-2.168-2.542C8.69 2.5 8.108 2.5 6.944 2.5c-1.816 0-2.724 0-3.406.38A3 3 0 0 0 2.38 4.038C2 4.72 2 5.628 2 7.444V10.5c0 4.714 0 7.071 1.464 8.535C4.822 20.394 6.944 20.493 11 20.5h1m10 1l-2.147-2.147m0 0a3.43 3.43 0 0 0 1.004-2.424a3.429 3.429 0 1 0-1.004 2.424" color="currentColor" />
                    </svg>`,
        'bomb': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <path d="M16 15a7 7 0 1 1-14 0a7 7 0 0 1 14 0" />
                        <path d="m12 8.5l-.531-1.329c-.16-.397-.24-.596-.346-.761a2 2 0 0 0-1.288-.872C9.643 5.5 9.428 5.5 9 5.5s-.643 0-.835.038a2 2 0 0 0-1.288.872c-.107.165-.186.364-.345.761L6 8.5m16-1L20.5 6m0 0L19 4.5M20.5 6L19 7.5M20.5 6L22 4.5M17 6c-3 0-2.59-2.56-5.14-3.733C9.62 1.237 8.77 3.407 9.052 5" />
                    </g>
                </svg>`,
        'happy': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M7 9c.21.583.775 1 1.44 1s1.229-.417 1.438-1m4.244 0c.21.583.774 1 1.439 1c.664 0 1.23-.417 1.439-1m-9 6a5 5 0 0 0 4 2a5 5 0 0 0 4-2" />
                    </g>
                </svg>`,
        'exclamation': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.322 9.683c2.413-4.271 3.62-6.406 5.276-6.956a4.45 4.45 0 0 1 2.804 0c1.656.55 2.863 2.685 5.276 6.956c2.414 4.27 3.62 6.406 3.259 8.146c-.2.958-.69 1.826-1.402 2.48C19.241 21.5 16.827 21.5 12 21.5s-7.241 0-8.535-1.19a4.66 4.66 0 0 1-1.402-2.48c-.362-1.74.845-3.876 3.259-8.147M11.992 16h.009M12 13V9" color="currentColor" />
                        </svg>`,
        'upload': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.478 9.011h.022c2.485 0 4.5 2.018 4.5 4.508c0 2.32-1.75 4.232-4 4.481m-.522-8.989q.021-.248.022-.5A5.505 5.505 0 0 0 12 3a5.505 5.505 0 0 0-5.48 5.032m10.958.98a5.5 5.5 0 0 1-1.235 3.005M6.52 8.032A5.006 5.006 0 0 0 2 13.018a5.01 5.01 0 0 0 4 4.91m.52-9.896q.237-.023.48-.023c1.126 0 2.165.373 3 1.002M12 13v8m0-8c-.7 0-2.008 1.994-2.5 2.5M12 13c.7 0 2.008 1.994 2.5 2.5" color="currentColor" />
                    </svg>`,

        // Add more icons as needed
    };

    // Get the SVG path for the given name
    const svgPath = icons[name as keyof typeof icons] || '';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={color}
    width={size}
    height={size}
    aria-hidden="true"
>
    {@html svgPath}
</svg>

<style>
    svg {
        display: inline-block;
        vertical-align: middle;
    }
</style> 