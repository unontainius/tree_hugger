<script lang="ts">
    let {options=[], currentValue = $bindable(), onChange} = $props<{
        options: {label: string, value: string}[];
        currentValue: string;
        onChange: (value: string) => void;
    }>();

    // Use event delegation for better performance
    function handleSelectedValueChanged(value: string) {
        currentValue = value;
        onChange(value);
    }
</script>

<div class="radio-inputs">
    {#each options as option}
        <button 
            class={"radio-btn" + (currentValue === option.value ? " selected" : "")}
            onclick={() => handleSelectedValueChanged(option.value)}
        >
            {option.label}
        </button>
    {/each}
</div>

<style>
    /* From Uiverse.io by Yaya12085 */ 
    .radio-inputs {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        border-radius: 2rem;
        background-color: #eeeeee56;
        box-sizing: border-box;
        padding: 0.25rem;
        margin: 0.5rem;
        font-size: 1rem;
        contain: content; /* Keep the performance optimization */
    }

    .radio-btn {
        box-shadow: none;
        background-color: transparent;
        border: none;
        padding: 0.5rem;
        padding-inline: 1rem;
        margin:0;
        cursor: pointer;
        border-radius: 0;
        border: 1px solid #ffffff2a;
        font-weight:200;
    }

    .radio-btn:hover {
        color:white;
        border:none;
        background-color: #16161696;
        transform:none;
    }

    .radio-btn:first-of-type {
        border-top-left-radius: 1.8rem;
        border-bottom-left-radius: 1.8rem;
        border-right:none;   
    }

    .radio-btn:last-of-type {
        border-top-right-radius: 1.8rem;
        border-bottom-right-radius: 1.8rem;
        border-left:none;
    }

    .radio-btn.selected {
        background-color: #eb7d00;
        font-weight: 600;
    }
</style>