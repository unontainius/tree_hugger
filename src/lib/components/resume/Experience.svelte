<div class="section-container">
	<h2>Experience</h2>
	<div class="experience-container">
		<div class="image">
			<img src="/images/marcus.jpg" alt="Marcus" class="experience-image" />
		</div>
		<div class="intro-text">
			<p>
				With a solid background in Information Technology, I excel at gathering and shaping
				information into innovative solutions. Driven by a passion for delivering exceptional
				products, I am dedicated to driving success and making a positive impact in any organisation
				I collaborate with.
			</p>
		</div>
		<div class="intro-text">
			<p>
				I am a dynamic and results-driven person who consistently exhibits a professional and
				approachable demeanor. I attribute my proven track record of exceeding goals and delivering
				exceptional results to my ability to build exceptional teams and leverage their individual
				strengths effectively.
			</p>
		</div>
	</div>
	<div class="info-cards">
		<div class="card">
			<h3 class="title">Freelancer</h3>
			<p class="date">2024 - present</p>
			<p class="card-text">
				Project Management, Requirements Gathering, Design, General development consulting.
			</p>
		</div>
		<div class="card">
			<h3 class="title">Systems and IT Development Manager</h3>
			<p class="date">2010 - 2024</p>
			<p class="card-text">
				Leading development teams and managing IT infrastructure while delivering innovative
				solutions.
			</p>
		</div>

		<div class="card">
			<h3 class="title">Education</h3>
			<p class="date">1991 - 1993</p>
			<p class="description">
				National Diploma in Business Computing<br />
				Nelson Institute of Technology, Nelson, NZ
			</p>
			<br />
			<p class="card-text">
				Completed a three-year intensive program with specialisation in Software Development. During
				the third year, worked on modernising community organisations' paper-based systems to a
				computer system.
			</p>
		</div>
	</div>
</div>

<style>
	.section-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		gap: 4rem;
		color: #f5f5f5;
		width: 90%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 4rem 2rem;
	}

	h2 {
		margin: 0;
		font-size: 3.5rem;
		font-weight: 300;
		text-align: center;
		color: #fff;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		position: relative;
	}

	h2::after {
		content: '';
		position: absolute;
		bottom: -1rem;
		left: 50%;
		transform: translateX(-50%);
		width: 60px;
		height: 3px;
		background: linear-gradient(90deg, #50dcff, #f302f3);
	}

	.experience-container {
		display: grid;
		grid-template-columns: minmax(200px, 300px) 1fr 1fr;
		gap: 3rem;
		width: 100%;
		align-items: start;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 1rem;
		backdrop-filter: blur(10px);
	}

	.image {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		border-radius: 1rem;
		overflow: hidden;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
	}

	.image::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(45deg, rgba(80, 220, 255, 0.1), rgba(243, 2, 243, 0.1));
		border-radius: inherit;
	}

	.image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: inherit;
		transition: transform 0.3s ease;
	}

	.image:hover img {
		transform: scale(1.05);
	}

	.intro-text {
		padding: 1.5rem;
		background: rgba(82, 82, 82, 0.1);
		border-radius: 1rem;
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.intro-text p {
		font-size: 1.1rem;
		line-height: 1.8;
		color: #b4e0f0;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.info-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		width: 100%;
	}

	.card {
		background: rgba(82, 82, 82, 0.15);
		border-radius: 1rem;
		padding: 2rem;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 4px;
		background: linear-gradient(90deg, #50dcff, #f302f3);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
	}

	.card:hover::before {
		opacity: 1;
	}

	.title {
		font-size: 1.4rem;
		font-weight: 500;
		color: #f3c702;
		margin-bottom: 0.5rem;
		letter-spacing: 0.05em;
	}

	.date {
		font-size: 1rem;
		color: #ff00f2;
		opacity: 0.9;
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.description {
		color: #03a5ce;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.card-text {
		color: #50dcff;
		line-height: 1.7;
		font-size: 1rem;
	}

	@media (max-width: 1024px) {
		.experience-container {
			grid-template-columns: 1fr;
			text-align: center;
		}

		.image {
			max-width: 300px;
			margin: 0 auto;
		}

		.intro-text {
			max-width: 100%;
		}
	}

	@media (max-width: 768px) {
		.section-container {
			width: 95%;
			padding: 2rem 1rem;
		}

		h2 {
			font-size: 2.5rem;
		}

		.card {
			padding: 1.5rem;
		}
	}
</style>
