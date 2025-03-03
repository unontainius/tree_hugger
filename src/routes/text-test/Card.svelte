<div class="card">
    <div class="title">Decorative Card</div>
    <p>This card combines multiple techniques using `::before` and `::after` to create a decorative effect with custom borders, icons, and background overlays.</p>
</div>
    
    <style>
        .card {
            position: relative;
            width: 300px;
            padding: 20px;
            margin: 50px auto;
            background: #fff;
            border: 2px solid #ccc;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        /* Background overlay */
        .card::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('/images/marcus.jpg') no-repeat center center;
            background-size: cover;
            opacity: 0.1;
            z-index: -1;
        }

        /* Decorative top border */
        .card::after {
            content: "";
            position: absolute;
            top: -10px;
            left: 50%;
            width: 60px;
            height: 10px;
            background: #e74c3c;
            transform: translateX(-50%);
        }

        .card .title {
            font-size: 1.5em;
            margin-bottom: 10px;
            text-align: center;
            position: relative;
        }

        /* Icon before title */
        .card .title::before {
            content: "⭐";
            font-size: 1em;
            color: #f39c12;
            position: absolute;
            top: 50%;
            left: -30px;
            transform: translateY(-50%);
        }

        /* Custom underline after title */
        .card .title::after {
            content: "";
            display: block;
            width: 50%;
            height: 2px;
            background: #333;
            margin: 10px auto 0;
        }

        .card p {
            font-size: 1em;
            line-height: 1.5;
        }
    </style>



