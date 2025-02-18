<script lang="ts">
    let { showMore } = $props<{
        showMore: () => void;
    }>();
</script>

<div class="project-detail-container">
    <h1>Project information</h1>
    <h2>Category:</h2> 
    <p>Bespoke Software Solution</p>
    <h2>Client:</h2> 
    <p>Anatoki Salmon</p>
    <h2>Project date:</h2> 
    <p>2015</p>
    <button onclick={showMore}>more info ...</button>
</div>


<!-- Project information
Category: Bespoke Software Solution
Client: Anatoki Salmon
Project date: 2015
Technologies Provided
Touch operation, Weighing, Barcode Scanning, POS, EFTPOS integration, Order progress tracking, centralised data storage and reporting, local networking.

Overview
Jan and his team at Antatoki Salmon provide a rather unique experience for their customers. Often, a unique business such as theirs is unable to source off the shelf software that is going meet any more than 60% of their business needs.

Because of our tight integration of hardware and software, we were able to supply an end-to-end solution to our customer that has enhanced their business, and their customers perceived professionalism of their business.

Solution
They required a system to track the progression of salmon caught on the premises all the way through to being served as meal.

For us, tracking began once the fish was caught and handed in for weighing and preparation. It continued through smoking and the sale of the salmon.

The custom POS application we built for the cafe area of this customer included the ability to classify meals as 'right now', or 'when the salmon arrives'. Because the salmon progress was being tracked, we were able to supply the kitchen with timing to ensure the rest of the customer's meal was prepared in time to arrive with the presentation of the customers prepared salmon. -->

<style>
    h1 {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    h2 {
        font-size: .8rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #01254b;
    }
    p {
        font-size: 1rem;
        margin-bottom: 0.5rem;
    }
    button {
        background-color: #013164cb;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-block-start: 1rem;
    }
    .project-detail-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        padding-block-start: 1rem;
    }

</style>



