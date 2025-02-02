<script lang="ts">
    let { name, size } = $props()



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
        'plus': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2" />
                </svg>`,
        'back': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512">
                    <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32" d="M256 64C150 64 64 150 64 256s86 192 192 192s192-86 192-192S362 64 256 64Z" />
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m296 352l-96-96l96-96" />
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
        'tick': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.474 17.306c3.013-3.224 5.922-5.411 9.576-8.508c1.094-.927 1.263-2.552.405-3.703c-.912-1.224-2.645-1.469-3.817-.496c-3.347 2.776-5.951 5.45-8.421 8.306c-.13.15-.195.225-.262.267a.52.52 0 0 1-.555.003c-.068-.041-.133-.115-.263-.262l-1.316-1.49a2.748 2.748 0 0 0-4.358.304a2.79 2.79 0 0 0 .253 3.406l2.064 2.29C6.323 19.135 7.095 19.992 8.022 20c.926.008 1.768-.892 3.452-2.694" color="currentColor" />
                </svg>`,
        'tick-2': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z" />
                </svg>`,
        'tick-3': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z" />
                </svg>`,
        'tick-4': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" fill-rule="evenodd" d="M13.7 4.19c.31.274.339.748.065 1.06l-5.75 6.5a.75.75 0 0 1-1.074.051l-3.75-3.5a.75.75 0 0 1 1.023-1.097l3.19 2.97l5.24-5.92a.75.75 0 0 1 1.06-.064z" clip-rule="evenodd" />
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
        'admin': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <path d="M20.5 16.929V10c0-3.771 0-5.657-1.172-6.828S16.271 2 12.5 2h-1C7.729 2 5.843 2 4.672 3.172S3.5 6.229 3.5 10v9.5" />
                        <path d="M8 3v3.69c0 .74 0 1.11.238 1.254q.014.01.032.017c.248.126.571-.064 1.219-.445c.484-.284.725-.427.992-.432h.037c.268.005.51.148.993.432c.648.381.971.571 1.22.445l.03-.017C13 7.8 13 7.43 13 6.69V3m7.5 14H6a2.5 2.5 0 0 0 0 5h14.5" />
                        <path d="M20.5 17a2.5 2.5 0 0 0 0 5" />
                    </g>
                </svg>`,
        'people': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                        <path d="M4.5 10c0-3.771 0-5.657 1.172-6.828S8.729 2 12.5 2H14c3.771 0 5.657 0 6.828 1.172S22 6.229 22 10v4c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-1.5c-3.771 0-5.657 0-6.828-1.172S4.5 17.771 4.5 14zm0-4H2m2.5 6H2m2.5 6H2" />
                        <path d="M15.275 8.493a2 2 0 1 1-4 0a2 2 0 0 1 4 0M9.32 15.716c1.058-1.63 2.739-2.24 3.955-2.239s2.847.61 3.906 2.24a.33.33 0 0 1 .025.344c-.247.439-1.016 1.31-1.57 1.369c-.638.067-2.307.077-2.36.077s-1.773-.01-2.41-.077c-.556-.06-1.324-.93-1.572-1.37c-.061-.109-.043-.238.026-.344" />
                    </g>
                </svg>`,
        'no-filter': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.999 4.5c-.012-.435-.103-.747-.327-.993C20.212 3 19.396 3 17.766 3H6.234c-1.63 0-2.445 0-2.906.507c-.461.508-.36 1.294-.158 2.866c.06.459.158.72.457 1.076c.969 1.15 2.742 3.197 5.23 5.057c.228.17.377.448.402.755c.28 3.425.537 5.765.674 6.917c.071.604.741 1.069 1.293.678c.927-.655 2.66-1.39 2.888-2.612c.085-.45.2-1.164.331-2.244M21 7l-6 6m6 0l-6-6" color="currentColor" />
                </svg>`,
        'no-sort': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M18.2 9.3L12 3L5.8 9.3c-.2.2-.3.4-.3.7s.1.5.3.7s.4.3.7.3h11c.3 0 .5-.1.7-.3s.3-.5.3-.7s-.1-.5-.3-.7M5.8 14.7L12 21l6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7s-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3s-.3.5-.3.7s.1.5.3.7" />
                </svg>`,
        'shit': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 64 64">
                        <g fill="#65b2df">
                            <path d="M48.764 4.132c-1.03-1.222-2.851-.297-4.476 1.075c-1.624 1.37-2.843 3.01-1.812 4.227c1.029 1.223 5.623 3.585 7.247 2.215s.07-6.298-.959-7.517" />
                            <path d="M56.872 7.883c1.6-.006 2.076 1.981 2.08 4.108c.008 2.125-.451 4.114-2.052 4.118c-1.595.008-6.369-1.965-6.374-4.089c-.011-2.127 4.75-4.13 6.346-4.137" />
                        </g>
                        <path fill="#25333a" d="M47.19 11.507c-.533.644-.234 1.772.668 2.516c.907.749 2.072.835 2.604.189l2.265-2.736c.533-.646.229-1.772-.673-2.524c-.902-.747-2.066-.829-2.601-.185z" />
                        <g fill="#65b2df">
                            <path d="M4.326 4.723c-.882.377-.677 1.588-.177 2.767c.496 1.175 1.222 2.167 2.108 1.792s3.06-2.597 2.56-3.776c-.501-1.177-3.609-1.156-4.491-.783" />
                            <path d="M7.923.728c.279-.919 1.505-.838 2.731-.463c1.223.373 2.285.989 2 1.911c-.279.917-2.26 3.31-3.482 2.937C7.95 4.742 7.642 1.647 7.921.728" />
                        </g>
                        <path fill="#25333a" d="M8.284 6.94c.283.42.98.449 1.567.062c.591-.386.849-1.044.57-1.465l-1.17-1.786c-.274-.42-.976-.445-1.571-.062c-.59.387-.845 1.042-.57 1.46z" />
                        <path fill="#a67c57" d="M30.437 6.04S.666 13.013 10.297 26.43l32.05 11.341l10.897-4.266s10.898-9.676-13.178-17.06c0 0-14.406-3.954-8.03-9.05c.002 0 1.191-1.456-1.602-1.356" />
                        <path fill="#936e4e" d="M39.981 16.45s-14.413-3.954-8.04-9.05c0 0 1.186-1.456-1.6-1.356c0 0-2.765.652-6.329 1.926c-4.672 4.821 8.655 8.48 8.655 8.48c24.08 7.383 13.178 17.06 13.178 17.06l-7.428 2.904l3.835 1.361l10.895-4.266s10.898-9.675-13.171-17.06" />
                        <path fill="#a77d51" d="M60.663 45.673c-2.06-2.231-5.575-4.721-11.347-7.378c0 0-23.07-5.108-37.37-1.561c-7.379 1.828-31.22 27.21 20.398 26.17c9.176-.181 22.802-1.443 29.15-8.285c.235-.061 5.586-2.752-.823-8.95" />
                        <path fill="#916b49" d="M60.806 45.673c-2.06-2.231-5.578-4.721-11.345-7.378c0 0-23.07-5.108-37.38-1.561c-1.83.453-4.672 2.353-7.121 4.944c6.587 4.458 23.581-4.585 30.421-3.565c7.199 1.068 17.03 3.983 16.789 13.154c-.103 3.913-.973 7.06-2.416 9.594c4.717-1.23 9.03-3.17 11.87-6.238c.235-.061 5.588-2.752-.819-8.95" />
                        <path fill="#b8895d" d="M55.02 35.38c-7.601-11.55-27.999-11.86-27.999-11.86c-17.358-.309-19.01 4.083-20.91 7.595c-6.108 11.279 4.942 9.359 4.942 9.359c4.184-.099 13.811-3.433 13.811-3.433c13.56-2.6 30.844 4.889 30.844 4.889c2.203-4.577-.688-6.55-.688-6.55" />
                        <path fill="#ab805a" d="M55.02 35.38c-7.601-11.55-27.999-11.86-27.999-11.86a46 46 0 0 0-3.995.083c5 .361 20.05 2.221 26.345 11.777c0 0 2.092 1.44 1.346 4.7c3.063 1.017 4.991 1.85 4.991 1.85c2.203-4.577-.688-6.55-.688-6.55" />
                        <path fill="#d09e77" d="M17.263 26.05s-8.401.558-8.884 8.091c0 0 .771 6.58 10.623 2.856c0 0 2.317-.636 0-2.064c0 0-9.664-3.647-2.801-7.374c0 0 3.379-1.188 1.062-1.509m9.265-17.057s-12.822 4.118-12.859 9.02c-.017 2.373 1.977 2.251 4.397.9c2.416-1.356 2.945-6.885 8.462-9.204c5.513-2.313 0-.719 0-.719M13.07 44.495c19.598 7.97 27.899 5.456 29.356 5.956c1.447.497 1.637 1.284-.952 2.19c-2.588.911-27.375 4.34-31.722.505c-4.34-3.834-3.59-11.463 3.318-8.651" />
                        <path fill="#fff" d="M45.06 29.1c0 5.058-2.736 9.157-6.115 9.157c-3.381 0-6.121-4.099-6.121-9.157c0-5.062 2.74-9.159 6.121-9.159c3.378 0 6.115 4.098 6.115 9.159" />
                        <path fill="#25333a" d="M39.78 29.947c0 1.917-1.279 3.469-2.862 3.469c-1.575 0-2.859-1.552-2.859-3.469s1.284-3.471 2.859-3.471c1.583 0 2.862 1.555 2.862 3.471" />
                        <path fill="#fff" d="M26.438 29.1c0 5.058-2.735 9.157-6.115 9.157c-3.376 0-6.116-4.099-6.116-9.157c0-5.062 2.74-9.159 6.116-9.159c3.379 0 6.115 4.098 6.115 9.159" />
                        <ellipse cx="21.958" cy="29.947" fill="#25333a" rx="2.863" ry="3.469" />
                        <path fill="#633d19" d="M33.984 41.01c-6.661 1.147-13.33 2.141-20.02 2.896c2.519 7.387 8.667 12.612 15.874 12.612c8.839 0 16.11-7.858 17.01-17.938c-4.279.858-8.565 1.687-12.86 2.43" />
                        <path fill="#e7e5e5" d="M33.808 47.605a395 395 0 0 1-14.986 2.588c2.178 3.466 7.01 5.665 12.448 5.25c6.665-.521 11.85-4.791 12.141-9.771a560 560 0 0 1-9.603 1.933" />
                        <path fill="#fff" d="M33.964 42.19a770 770 0 0 1-19.761 2.806c2.748 3.039 9.03 4.856 16.17 4.307c8.766-.681 15.714-4.68 16.26-9.159c-4.217.702-8.438 1.395-12.671 2.046" />
                </svg>`,
        'no-image': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="currentColor">
                            <circle cx="16.5" cy="7.5" r="1.5" />
                            <path d="M2 14.135q1.001-.135 2.016-.132c2.856-.056 5.642.77 7.86 2.331c2.06 1.448 3.505 3.44 4.124 5.666m-2.5-4.5c1-1 1.677-1.223 2.5-1.5" />
                            <path d="M20 20.213C18.601 21.5 16.363 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12c0-4.363 0-6.601 1.287-8M20 16c.543 0 1.048.294 1.397.564c.103-1.195.103-2.681.103-4.564c0-4.478 0-6.718-1.391-8.109S16.479 2.5 12 2.5c-2.41 0-4.17 0-5.5.217M2 2l20 20" />
                        </g>
                </svg>`,
        // Add more icons as needed
    };

    // Get the SVG path for the given name
    const svgPath = icons[name as keyof typeof icons] || '';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
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