<script lang="ts">
	import MIcon from "../common/MIcon.svelte";

    let purchase = [{"leading":"..................................................... ","item":"Pinot Noir (bottle)"}, 
                    {"leading":"......................................................... ","item":"Spinach Ravioli"},
                    {"leading":"......................................... ","item":"Ceasar Salad (no onions)"},
                    {"leading":"..........................................................  ","item":"Caazone Pizza"},
                    {"leading":"............................................................ ","item":"Tiramasu (x3)"},
                    {"leading":".................................................................. ","item":"Cabonara"},
                    {"leading":".......... ","item":"Ceasar Salad (no onions)"},
                    {"leading":"........................... ","item":"Caazone Pizza"},
                    ]



</script>


<div class="pos-table-detail">
    <div class="time-header">
        <h1>Tuesday, 06:42</h1>
        <MIcon name="partly-cloudy" size="42" />
    </div>
    <div class="panel-container">
        <div class="panel-header">
            <h2>TABLE 01</h2>
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
            <button class="btn-blue">
                <MIcon name="view" size="52" color="#000000"/>
                See Order
            </button>
            <button class="btn-blue">
                <MIcon name="edit" size="52" color="#000000"/>
                Edit Order
            </button>
            <button class="btn-blue">
                <MIcon name="split" size="52" color="#000000"/>
                Split Order
            </button>
            <button class="payment-btn">
                <MIcon name="dollar" size="52" color="white"/>
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
        font-size: 2.5rem;
        letter-spacing: 0.2rem;
        font-weight: 600;
        color: #ffffff;
    }
    .pos-table-detail h2 {
        font-size: 2.0rem;
        letter-spacing: 0.2rem;
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
        font-size: 2.1rem;
        font-weight: 500;       
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
        margin-block-start: 1rem;
        margin-block-end: 0rem;
    }
    .item-name {
        font-size: 1.2rem;
        font-weight: 400;
        color: #ffffff;
    }
    ul {
        list-style: none;
        padding: 0;
        width:100%;
        margin: 0 auto;
        font-size: 1.2rem;
    }
    ul li {
        display: flex;
    }
    .total-price {
        font-size: 5.5rem;
        letter-spacing: 0.3rem;
        padding:0;
        margin:0;
        font-weight:500;
        color: #ffffff;
        font-family: 'Poppins', sans-serif;
        margin-block-end: -1rem;
    }
    .btns {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 1.25rem;
        padding-inline:1rem;

    }
    .btns button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        column-gap: 2.5rem;
        width: 100%;
        height: 64px;
        border-radius: 2rem;
        background-color: #ffffff;
        color: #000000;
        font-size: 2.5rem;
        margin:0;
    }
    button.payment-btn {
        background-color: #000000;
        color: #ffffff;
        font-size: 2.2rem;
    }
    button.btn-blue {
        background: rgb(0,194,199);
        background: -moz-linear-gradient(180deg, rgba(0,194,199,1) 0%, rgba(47,247,255,1) 39%, rgba(99,249,255,1) 50%, rgba(60,250,255,1) 60%, rgba(0,190,184,1) 100%);
        background: -webkit-linear-gradient(180deg, rgba(0,194,199,1) 0%, rgba(47,247,255,1) 39%, rgba(99,249,255,1) 50%, rgba(60,250,255,1) 60%, rgba(0,190,184,1) 100%);
        background: linear-gradient(180deg, rgba(0,194,199,1) 0%, rgba(47,247,255,1) 39%, rgba(99,249,255,1) 50%, rgba(60,250,255,1) 60%, rgba(0,190,184,1) 100%);
        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#00c2c7",endColorstr="#00beb8",GradientType=1);
        color: #000000;
        font-size: 2.5rem;
        font-weight: 500;
        border: 3px solid #000000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }   
</style>