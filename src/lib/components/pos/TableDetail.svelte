<script lang="ts">
	import MIcon from "../common/MIcon.svelte";

    let purchase = [{"leading":"...................... ","item":"Pinot Noir (bottle)"}, 
                    {"leading":".......................... ","item":"Spinach Ravioli"},
                    {"leading":".......... ","item":"Ceasar Salad (no onions)"},
                    {"leading":"............................ ","item":"Caazone Pizza"},
                    {"leading":"............................. ","item":"Tiramasu (x3)"},
                    {"leading":".......................... ","item":"Spinach Ravioli"},
                    {"leading":".......... ","item":"Ceasar Salad (no onions)"},
                    {"leading":"........................... ","item":"Caazone Pizza"},
                    ]



</script>


<div class="pos-table-detail">
    <div class="time-header">
        <h1>Tuesday, 06:42</h1>
        <MIcon name="partly-cloudy" size="24" />
    </div>
    <div class="panel-container">
        <div class="panel-header">
            <h1>TABLE 01</h1>
        </div>
        <div class="list">
            <ul>
                {#each purchase as item}
                    <li>
                        {item.leading} 
                        <div class="item-name">{item.item}</div> 
                    </li>
                {/each}
            </ul>
        </div>
        <div class="total-price">
             $88.50
        </div>

        <div class="btns">
            <button>
                <MIcon name="view" size="32" color="#000000"/>
                See order
            </button>
            <button>
                <MIcon name="edit" size="32" color="#000000"/>
                Edit Order
            </button>
            <button>
                <MIcon name="split" size="32" color="#000000"/>
                Split Order
            </button>
            <button class="payment-btn">
                <MIcon name="dollar" size="32" color="white"/>
                Take Payment
            </button>
        </div>
    </div>
</div>


<style>
    .pos-table-detail {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: transparent;
        border: 1px solid #5555552a;
        padding: 0.5rem 0.5rem;
        overflow-x: auto;
        overflow-y: hidden;
        border-top-right-radius: 2rem;
        border-bottom-right-radius: 2rem;
    }
    .pos-table-detail h1 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #ffffff;
    }
    .panel-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: 100%;
        background: rgb(245,66,99);
        background: -moz-linear-gradient(87deg, rgba(245,66,99,1) 0%, rgba(142,39,245,1) 100%);
        background: -webkit-linear-gradient(87deg, rgba(245,66,99,1) 0%, rgba(142,39,245,1) 100%);
        background: linear-gradient(87deg, rgba(245,66,99,1) 0%, rgba(142,39,245,1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#f54263",endColorstr="#8e27f5",GradientType=1);
        border-radius: 2rem;

    }
    .time-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 1rem;
    }
    .panel-header {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        width: 100%;
        height: 50px;
        border-block-end: 3px solid #000000;
    }
    .list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 90%;
        height: 120px;
        overflow-y: auto;
        overflow-x: hidden;
        margin-block-start: 2rem;
        margin-block-end: 3rem;
    }
    .item-name {
        font-size: 1rem;
        font-weight: 400;
        color: #ffffff;
    }
    ul {
        list-style: none;
        padding: 0;
        width:100%;
        margin: 0 auto;
        font-size: 1rem;
    }
    ul li {
        display: flex;
    }
    .total-price {
        font-size: 4rem;
        font-weight: 800;
        color: #ffffff;
        font-family: 'Poppins', sans-serif;
    }
    .btns {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 1rem;
        padding-inline:1rem;

    }
    .btns button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 64px;
        border-radius: 2rem;
        background-color: #ffffff;
        color: #000000;
        font-size: 1.5rem;
    }
    button.payment-btn {
        background-color: #000000;
        color: #ffffff;
        font-size: 1.2rem;
    }
</style>