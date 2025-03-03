<script>
    let {
        text = "Hover me", 
        color = "#000", 
        background = "#fff",
        fontSize = "1.44rem",
        onclick
    } = $props();
</script>

<div class="container">
    <button 
        class="gradient-button"
        style="color: {color}; background: {background}; font-size: {fontSize}" 
        onclick={onclick}
    >
        {text}
    </button>
</div>

<!-- /* From Uiverse.io by Spacious74 */  -->
<style>
    .container {
        position: relative;
        padding: 0;
        background: linear-gradient(90deg, #03a9f4, #f441a5);
        border-radius: 12em;
        transition: all 0.4s ease;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .gradient-button {
        position: relative;
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        margin: 2px;
        letter-spacing: 0.07rem;
        font-weight: 400;
        padding: 0.2rem 0.8rem;
        border-radius: 12em;
        border: none;
        cursor: pointer;
        box-shadow: 2px 2px 3px #000000b4;
        transition: all 0.3s ease;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .container::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, #03a9f4, #f441a5);
        border-radius: 12em;
        z-index: 0;
        filter: blur(0);
        transition: filter 0.4s ease;
    }

    .container:hover::before {
        filter: blur(1em);
    }

    .container:active::before {
        filter: blur(0.2em);
    }

</style>
