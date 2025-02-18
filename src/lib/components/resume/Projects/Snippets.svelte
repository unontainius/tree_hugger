<script>
    let { client, date, category, technologies, overview, solution } = $props();
</script>


    <div class="heading">
        <h1>Project information</h1>
        <h2>Category:</h2> 
        <p>{category}</p>
    </div>
    <div class="content">
        <p>Client:</p>
        <p>{client}</p>
        <p>Project date:</p>
        <p>{date}</p>
    </div>
    <div class="technologies">
        <p>Technologies Provided</p>
        <p>{technologies}</p>
    </div>
    <div class="overview">
        <p>Overview</p>
        <p>{overview}</p>
    </div>
    <div class="solution">
        <p>Solution</p>
        <p>{solution}</p>
    </div>

<style>
    .heading {
        font-size: 2rem;
        font-weight: bold;
    }
    .content {
        font-size: 1.5rem;
    }
    .technologies {
        font-size: 1.5rem;
    }
    .overview {
        font-size: 1.5rem;
    }
    .solution {
        font-size: 1.5rem;
    }
</style>

