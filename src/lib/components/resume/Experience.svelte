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
	h2 {
		margin: 0;
		font-size: 3rem;
		font-weight: 600;
		text-align: center;
		color: #f302f3;
	}
	p {
		margin: 0;
		padding: 0;
		font-size: 0.9rem;
	}
	.experience-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}
	.section-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;

		color: #cfcece;
		width: 75%;
	}
	.image {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-width: 200px;
		min-height: 200px;
		object-fit: cover;
		border-radius: 50%;
		background-color: #525252;
		padding: 0.5rem;
	}
	.image img {
		width: 200px;
		height: 200px;
		object-fit: cover;
		border-radius: 50%;
	}
	.intro-text {
		flex: 1;
		min-width: 300px;
		max-width: 25%;
		justify-content: flex-start;
		color: #50dcff;
	}
	.info-cards {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 1rem;
		gap: 1rem;
	}
	.card {
		flex: 1;
		min-width: 300px;
		max-width: 25%;
		justify-content: flex-start;
		background-color: #525252;
		color: #cfcece;
		border-radius: 1rem;
		box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
		gap: 0.25rem;
		padding: 0;
		margin: 0;
		text-align: left;
	}
	.title {
		font-size: 1.2rem;
		padding: 0;
		margin: 0;
		width: 100%;
		border-bottom: 1px solid #cfcece;
		padding-inline-start: 1rem;
		padding-block-start: 0.5rem;
		color: #f3c702;
	}
	.date {
		font-size: 1.2rem;
		color: #ff00f2;
		line-height: 1.5;
		padding: 0;
		margin: 0;
		width: 100%;
		padding-inline-start: 1rem;
	}

	.description {
		font-size: 1rem;
		width: 100%;
		padding-inline-start: 1rem;
		color: #03a5ce;
	}
	.card-text {
		padding: 1rem;
		padding-block-start: 0;
		color: #50dcff;
	}
</style>
